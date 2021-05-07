const { test } = require('tap')
const timers = require('.')
const AbortController = require('abort-controller')

test('setTimeout', async t => {
  await t.test('simple', async t => {
    const start = new Date()
    const ret = await timers.setTimeout(1000, 'value')
    t.ok(new Date() - start >= 1000)
    t.equal(ret, 'value')
  })
  await t.test('no value', async t => {
    await timers.setTimeout(0)
  })
  await t.test('abort', async t => {
    await t.test('after wait', async t => {
      const controller = new AbortController()
      const start = new Date()
      const promise = timers.setTimeout(10000, 'value', {
        signal: controller.signal
      })
      controller.abort()
      try {
        await promise
      } catch (err) {
        t.equal(err.type, 'AbortError')
        t.ok(new Date() - start < 1000)
        return
      }
      throw new Error('did not throw')
    })
    await t.test('before wait', async t => {
      const controller = new AbortController()
      controller.abort()
      const start = new Date()
      const promise = timers.setTimeout(10000, 'value', {
        signal: controller.signal
      })
      try {
        await promise
      } catch (err) {
        t.equal(err.type, 'AbortError')
        t.ok(new Date() - start < 1000)
        return
      }
      throw new Error('did not throw')
    })
  })
  await t.test('validation', async t => {
    await t.test('options', async t => {
      try {
        await timers.setTimeout(1000, 'value', 'string')
      } catch (err) {
        t.equal(err.message, 'options must be of type Object')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
    await t.test('options.signal', async t => {
      try {
        await timers.setTimeout(1000, 'value', { signal: {} })
      } catch (err) {
        t.equal(err.message, 'options.signal must be of type AbortSignal')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
    await t.test('options.ref', async t => {
      try {
        await timers.setTimeout(1000, 'value', { ref: 'string' })
      } catch (err) {
        t.equal(err.message, 'options.ref must be of type boolean')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
  })
})

test('setImmediate', async t => {
  await t.test('simple', async t => {
    const ret = await timers.setImmediate('value')
    t.equal(ret, 'value')
  })
  await t.test('no value', async t => {
    await timers.setImmediate()
  })
  await t.test('abort', async t => {
    await t.test('after wait', async t => {
      const controller = new AbortController()
      const start = new Date()
      const promise = timers.setImmediate('value', {
        signal: controller.signal
      })
      controller.abort()
      try {
        await promise
      } catch (err) {
        t.equal(err.type, 'AbortError')
        t.ok(new Date() - start < 1000)
        return
      }
      throw new Error('did not throw')
    })
    await t.test('before wait', async t => {
      const controller = new AbortController()
      controller.abort()
      const start = new Date()
      const promise = timers.setImmediate('value', {
        signal: controller.signal
      })
      try {
        await promise
      } catch (err) {
        t.equal(err.type, 'AbortError')
        t.ok(new Date() - start < 1000)
        return
      }
      throw new Error('did not throw')
    })
  })
  await t.test('validation', async t => {
    await t.test('options', async t => {
      try {
        await timers.setImmediate('value', 'string')
      } catch (err) {
        t.equal(err.message, 'options must be of type Object')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
    await t.test('options.signal', async t => {
      try {
        await timers.setImmediate('value', { signal: {} })
      } catch (err) {
        t.equal(err.message, 'options.signal must be of type AbortSignal')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
    await t.test('options.ref', async t => {
      try {
        await timers.setImmediate('value', { ref: 'string' })
      } catch (err) {
        t.equal(err.message, 'options.ref must be of type boolean')
        t.equal(err.code, 'ERR_INVALID_ARG_TYPE')
        return
      }
      throw new Error('did not throw')
    })
  })
})
