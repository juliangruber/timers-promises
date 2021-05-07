# timers-promises

[Timers Promises API](https://nodejs.org/api/timers.html#timers_timers_promises_api), for node 14 and below.

## Example

```js
const timers = require('timers-promises')

await timers.setTimeout(5000)
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
