var Promise = require('bluebird');
var _ = require('lodash');

module.exports = limit;

function limit (fn, opts, context) {
	opts = _.defaults(opts || {}, {
		limit: 1,
		per: 1000,
		jitter: 100
	});

	var halfjitter = opts.jitter/2;
	var base = Math.ceil(opts.per/opts.limit);
	var since = new Date();
	var outstanding = 0;

	function limited () {
		outstanding++;

		var args = Array.prototype.slice.call(arguments);
		
		var expectedPeriod = Math.ceil(outstanding*base - halfjitter + Math.random()*opts.jitter);
		var actualPeriod = new Date() - since;
		
		since = new Date();

		var precondition = actualPeriod >= expectedPeriod - 25 // no point in delaying call to 1-25 msec
			? Promise.resolve()
			: Promise.delay(expectedPeriod - actualPeriod);

		return precondition.then(function () {
			return fn.apply(context, args);
		}).tap(function () {
			outstanding--;
		});
	}

	return limited;
}
