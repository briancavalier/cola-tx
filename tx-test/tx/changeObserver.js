(function(define) {
define(function() {

	return function createObserver(prepareDiff, handler) {
		return function(array) {
			var diff = prepareDiff(array);

			return function(tx) {
				return tx.then(function() {
					return handler(tx, diff(array));
				}, function() {
					return handler(tx, diff(array));
				});
			};
		};
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
