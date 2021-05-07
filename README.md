# timers-promises

[Timers Promises API](https://nodejs.org/api/timers.html#timers_timers_promises_api), for node 14 and below.

## Example

```js
const timers = require('timers-promises')
const AbortController = require('abort-controller')

await timers.setTimeout(5000)

// With abort
const controller = new AbortController()
await timers.setTimeout(10000, 'value', {
  signal: controller.signal
})
// in another context
controller.abort()
```

## API

See https://nodejs.org/api/timers.html#timers_timers_promises_api.

## Roadmap

- [x] `setTimeout([delay[, value[, options]]])`
- [x] `setImmediate([value[, options]])`
- [ ] `setInterval([delay[, value[, options]]])`

## Kudos

Development of this module is sponsored by [Transloadit](https://github.com/transloadit).

## License

MIT
