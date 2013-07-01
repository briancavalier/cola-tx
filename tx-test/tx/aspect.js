(function(define) {
define(function() {

	return function(begin, observer) {
		return {
			around: function(joinpoint) {
				var methodResult;

				begin(function(tx) {
					// TODO: How to handle a failure here?
					var observerResult = observer(tx);

					methodResult = joinpoint.proceed();

					return [methodResult, observerResult];
				});

				return methodResult;
			}
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
