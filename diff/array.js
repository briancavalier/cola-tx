(function(define) {
define(function() {

	var undef;

	return function(snapshotItem) {

		return function(before) {

			var snapshot = before.reduce(function(snapshot, item, index) {
				var s = snapshot[item.id] = {
					item: item,
					index: index
				};

				if(snapshotItem) {
					s.compare = snapshotItem(item);
				}

				return snapshot;
			}, {});

			return function(after) {
				var seenIds, changes;

				seenIds = {};

				changes = after.reduce(function(changes, item, index) {
					var s, diff;
					if(item.id in snapshot) {
						// Changed items
						s = snapshot[item.id];

						// Shallow compare
						if(s.item !== item) {
							// Different object with the same id, call it an update
							changes.push({
								type: 'updated',
								object: after,
								index: index
							});
						} else if(s.compare) {
							// Deep compare if same object.
							diff = s.compare(item);
							if(diff) {
								changes.push({
									type: 'updated',
									object: after,
									index: index,
									changes: diff
								});
							}
						}
						seenIds[item.id] = 1;
					} else {
						// Newly added items
						changes.push({
							type: 'new',
							object: after,
							index: index
						});
					}

					return changes;
				}, []);

				changes = Object.keys(snapshot).reduce(function(changes, key) {
					var s;
					if(!(key in seenIds)) {
						// Removed items
						s = snapshot[key];
						changes.push({
							type: 'deleted',
							object: after,
							index: s.index,
							oldValue: s.item
						});
					}

					return changes;
				}, changes);

				return changes.length ? changes : undef;
			};
		};

	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
