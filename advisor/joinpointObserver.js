/**
 * joinpointObserver
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when, propertyChangeObserver;

	when = require('when');
	propertyChangeObserver = require('../tx/propertyChangeObserver');

	return function(observerMap, resultObserver) {

		return function(tx, joinpoint) {

			var candidates, name, target, method, args;

			target = joinpoint.target;
			method = joinpoint.method;
			args = joinpoint.args;

			// Find candidate objects in method arguments,
			// and in target object's properties

			candidates = args.slice();

			var prepared = candidates.reduce(function(prepared, candidate) {
				var found = findObserver(observerMap, candidate);
				if(found) {
					prepared.push(found.observer(candidate)(tx, candidate));
				}

				return prepared;
			}, []);

			for(name in target) {
				var found = findObserver(observerMap, target[name]);
				if(found) {
					// TODO: Very ugly, but works
					prepared.push(propertyChangeObserver(found.observer, name)(target)(tx, target));
				}
			}

			return function(result) {
				if(resultObserver) {
					prepared.push(resultObserver(tx, result));
				}
				return when.all(prepared);
			};
		};

	};

	function findObserver(map, candidate) {
		var found;

		map.some(function(item) {
			if(item.test(candidate)) {
				found = item;
				return true;
			}
		});

		return found;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
