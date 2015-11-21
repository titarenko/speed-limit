var Promise = require('bluebird');
var debug = require('debug')('speed-limit');

module.exports = limit;

function limit (fn, opts, context) {
	var opts = _.defaults(opts || {}, {
		limit: 1,
		per: 1000,
		jitter: 100
	});

	var base = Math.ceil(opts.per/opts.limit) - opts.jitter/2;
	var since = new Date();

	function limited () {
		var args = Array.prototype.slice.call(arguments);
		
		var expectedPeriod = Math.ceil(base + Math.random()*opts.jitter);
		var actualPeriod = new Date() - since;

		if (actualPeriod >= expectedPeriod) {
			debug('firing %j immediately', args);
			since = new Date();
			return fn.apply(context, args);
		}

		var period = expectedPeriod - actualPeriod;
		debug('delaying %j to %d ms', args, period);
		since = new Date();
		return Promise.delay(period).then(function () {
			debug('firing %j', args);
			return fn.apply(context, args);
		});
	}

	return limited;
}