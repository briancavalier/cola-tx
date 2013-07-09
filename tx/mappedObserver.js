(function(define) {
define(function() {

	return function createObserver(map, prepareDiff, handler) {
		return function(x) {
			var diff = prepareDiff(map(x));

			return function(tx) {
				return handler(diff(map(x)), tx);
			};
		};
	};


});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
