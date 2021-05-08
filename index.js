// Based on
// https://github.com/nodejs/node/blob/9158d61debaf2c9cb05820454788f859274c7470/lib/timers/promises.js

'use strict'

class ERR_INVALID_ARG_TYPE extends Error {
  constructor (name, expected) {
    super(`${name} must be of type ${expected}`)
    this.code = 'ERR_INVALID_ARG_TYPE'
  }
}

class AbortError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.type = 'AbortError'
  }
}

const validateAbortSignal = (signal, name) => {
  if (
    signal !== undefined &&
    (signal === null || typeof signal !== 'object' || !('aborted' in signal))
  ) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal')
  }
}

function promisesSetTimeout (after, value, options = {}) {
  const args = value !== undefined ? [value] : value
  if (options == null || typeof options !== 'object') {
    return Promise.reject(new ERR_INVALID_ARG_TYPE('options', 'Object'))
  }
  const { signal, ref = true } = options
  try {
    validateAbortSignal(signal, 'options.signal')
  } catch (err) {
    return Promise.reject(err)
  }
  if (typeof ref !== 'boolean') {
    return Promise.reject(new ERR_INVALID_ARG_TYPE('options.ref', 'boolean'))
  }
  // TODO(@jasnell): If a decision is made that this cannot be backported
  // to 12.x, then this can be converted to use optional chaining to
  // simplify the check.
  if (signal && signal.aborted) {
    return Promise.reject(new AbortError())
  }
  let oncancel
  const ret = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => resolve(value), after, ...(args || []))
    /* istanbul ignore next */
    if (!ref) timeout.unref()
    if (signal) {
      oncancel = () => {
        clearTimeout(timeout)
        reject(new AbortError())
      }
      signal.addEventListener('abort', oncancel)
    }
  })
  return oncancel !== undefined
    ? ret.finally(() => signal.removeEventListener('abort', oncancel))
    : ret
}

function promisesSetImmediate (value, options = {}) {
  if (options == null || typeof options !== 'object') {
    return Promise.reject(new ERR_INVALID_ARG_TYPE('options', 'Object'))
  }
  const { signal, ref = true } = options
  try {
    validateAbortSignal(signal, 'options.signal')
  } catch (err) {
    return Promise.reject(err)
  }
  if (typeof ref !== 'boolean') {
    return Promise.reject(new ERR_INVALID_ARG_TYPE('options.ref', 'boolean'))
  }
  // TODO(@jasnell): If a decision is made that this cannot be backported
  // to 12.x, then this can be converted to use optional chaining to
  // simplify the check.
  if (signal && signal.aborted) {
    return Promise.reject(new AbortError())
  }
  let oncancel
  const ret = new Promise((resolve, reject) => {
    const immediate = setImmediate(() => resolve(value))
    /* istanbul ignore next */
    if (!ref) immediate.unref()
    if (signal) {
      oncancel = () => {
        clearImmediate(immediate)
        reject(new AbortError())
      }
      signal.addEventListener('abort', oncancel)
    }
  })
  return oncancel !== undefined
    ? ret.finally(() => signal.removeEventListener('abort', oncancel))
    : ret
}

module.exports = {
  setTimeout: promisesSetTimeout,
  setImmediate: promisesSetImmediate
}
