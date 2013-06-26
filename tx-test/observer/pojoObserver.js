/**
 * pojoObserver
 * @author: brian
 */
(function(define) {
define(function() {

	return function(notify, makeComparator, list) {
		var stats;

		stats = generateStats(makeComparator, list);

		return function(dataObjects, tx) {
			var candidates;

			// Find candidate data objects

			candidates = dataObjects.reduce(function(candidates, obj) {
				return findCandidate(candidates, stats, obj);
			}, []);

			// If we found some candidates, when the transaction
			// is about to commit, diff all the candidates with their
			// previous value, to collect items that actually changed,
			// and then notify.
			if(candidates.length) {
				return tx.then(function() {
					return notify(findChanges(candidates));
				});
			}
		}
	}

	function findChanges(candidates) {
		return candidates.reduce(function (changes, s) {
			if (s.compare(s.value)) {
				changes.push(s.value);
				delete s.changed;
			}
			return changes;
		}, []);
	}

	function findCandidate(candidates, stats, value) {
		stats.some(function(s) {
			if(!s.changed && s.value === value) {
				s.changed = true;
				candidates.push(s);
				return true;
			}
		});

		return candidates;
	}

	function generateStats(makeComparator, list) {
		return list.reduce(function(statusList, item) {
			if(typeof item === 'object') {
				statusList.push({
					compare: makeComparator(item),
					value: item
				});
			}
			return statusList;
		}, []);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
