/**
 * pojoObserver
 * @author: brian
 */
(function(define) {
define(function() {

	return function(prepare, object) {
		return function(tx) {
			var handler = prepare(object);

			return handler(tx);
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
