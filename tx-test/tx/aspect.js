(function(define) {
define(function() {

	return function(begin, joinpointObserver) {
		return {
			around: function(joinpoint) {
				return begin(function(tx) {
					joinpointObserver(joinpoint, tx);

					return joinpoint.proceed();
				});
			}
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
