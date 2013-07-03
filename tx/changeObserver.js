(function(define) {
define(function() {

	return function createObserver(prepareDiff, handler) {
		return function(x) {
			var diff = prepareDiff(x);

			return function(tx, y) {
				return tx.then(function() {
					return handler(tx, diff(y));
				}, function() {
					return handler(tx, diff(y));
				});
			};
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
