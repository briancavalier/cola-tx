(function(define) {
define(function() {

	var undef;

	return function(snapshotItem) {

		return function(before) {

			var snapshot = before.reduce(function(snapshots, item, index) {
				var s = snapshots[item.id] = {
					item: item,
					index: index
				};

				if(snapshotItem) {
					s.compare = snapshotItem(item);
				}

				return snapshots;
			}, {});

			return function(after) {
				var seenIds, changes;

				seenIds = {};

				changes = after.reduce(function(changes, item, index) {
					var s, diff;
					if(item.id in snapshot) {
						// Changed items
						s = snapshot[item.id];

						if(s && s.compare) {
							// Deep compare if possible
							diff = s.compare(item);
							if(diff) {
								changes.push({
									type: 'updated',
									object: after,
									name: index,
									changes: diff
								});
							}
						} else if(s.item !== item) {
							// Shallow compare
							// Different object with the same id
							changes.push({
								type: 'updated',
								object: after,
								name: index,
								oldValue: s.item
							});
						}
						seenIds[item.id] = 1;
					} else {
						// Newly added items
						changes.push({
							type: 'new',
							object: after,
							name: index
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
							name: s.index,
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
