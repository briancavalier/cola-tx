/**
 * joinpointObserver
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when = require('when');

	return function(observerMap) {

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

			var prepared = candidates.reduce(function(prepared, candidate) {
				var observer = findObserver(observerMap, candidate);
				if(observer) {
					prepared.push(observer(tx));
				}

				return prepared;
			}, []);

			return when.all(prepared);
		};

	};

	function findObserver(map, candidate) {
		var found;

		map.some(function(item) {
			if(item.value === candidate) {
				found = item.observer;
				return true;
			}
		});

		return found;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
