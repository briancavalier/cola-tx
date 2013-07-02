(function(define) {
define(function() {

	return function(before) {
		var snapshot = Object.keys(before).reduce(function(snapshot, key) {
			snapshot[key] = before[key];
			return snapshot;
		}, {});

		return function(after) {
			var changes = Object.keys(after).reduce(function(changes, key) {
				if(key in snapshot) {
					if(snapshot[key] !== after[key]) {
						// Property value changed
						changes.push({
							type: 'updated',
							object: after,
							name: key,
							oldValue: snapshot[key]
						});
					}
				} else {
					// Property added
					changes.push({
						type: 'new',
						object: after,
						name: key
					});
				}

				return changes;
			}, []);

			changes = Object.keys(snapshot).reduce(function(changes, key) {
				if(!(key in after)) {
					// Property deleted
					changes.push({
						type: 'deleted',
						object: after,
						name: key
					});
				}

				return changes;
			}, changes);

			return changes.length ? changes : false;
		}
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
