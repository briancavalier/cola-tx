(function(define) {
define(function() {

	return function createObserver(prepareDiff, handler) {
		return function(x) {
			var diff = prepareDiff(x);

			return function(tx) {
				return handler(diff(x), tx);
			};
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
