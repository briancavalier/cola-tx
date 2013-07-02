(function(define) {
define(function() {

	return function wrapObserver(observer, property) {
		return function(object) {
			var observe = observer(object[property]);

			return function(tx, object) {
				return tx.then(function() {
					return observe(tx, object[property]);
				});
			}
		};
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
