/**
 * begin
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when = require('when');

	return function create() {
		var tx, commit, completed, depth;

		depth = 0;

		return function begin(run) {
			var result, error, threw;

			if(depth === 0) {
				tx = when.defer();
				commit = tx.promise;
				completed = when.defer();
			}

			depth += 1;
			try {
				result = run(tx.promise);
				commit = commit.yield(result[1])
			} catch(e) {
				threw = true;
				error = e;
			} finally {
				depth -= 1;
			}

			if(depth === 0) {
				if(threw) {
					tx.reject(error).ensure(function() {
						return commit.ensure(function() {
							return completed.reject(error);
						});
					});
				} else {
					return when(result[0],
						function(r) {
							tx.resolve();
							return completed.resolve(commit).yield(r);
						},
						tx.reject);
				}
			}

			return completed.promise;
		}

	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
