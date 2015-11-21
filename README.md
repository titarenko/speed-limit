# speed-limit

## Installation

```bash
npm i speed-limit
```

## Example

```js
var limit = require('speed-limit');

// note: it returns promise
function myFunc () {
	return db('orders').whereNotNull('price');
}

// limit call rate to 1 call per 1 sec with jitter ±200 msec
var myFuncLimited = limit(myFunc, { limit: 1, per: 1000, jitter: 200 });
```

## License

MIT
