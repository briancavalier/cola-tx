/**
 * joinpointObserver
 * @author: brian
 */
(function(define) {
define(function() {

	return function(observer) {

		return function(joinpoint, tx) {

			var candidates, name, target, method, args;

			target = joinpoint.target;
			method = joinpoint.method;
			args = joinpoint.args;

			// Find candidate objects in method arguments,
			// and in target object's properties

			candidates = args.slice();

			for(name in target) {
				candidates.push(target[name]);
			}

			return observer(candidates, tx);
		}

	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
