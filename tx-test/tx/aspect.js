(function(define) {
define(function() {

	return function(begin, joinpointObserver) {
		return {
			around: function(joinpoint) {
				var methodResult;

				begin(function(tx) {
					var observerResult = joinpointObserver(joinpoint, tx);

					methodResult = joinpoint.proceed();

					return [methodResult, observerResult];
				});

				return methodResult;
			}
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
