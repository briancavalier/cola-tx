(function(define) {
	define(function() {

		return function wrapObserver(map, observer) {
			return function(x) {
				var observe = observer(map(x));

				return function(y) {
					return function(tx) {
						return observe(map(y))(tx);
					}
				};
			};
		};

	});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
