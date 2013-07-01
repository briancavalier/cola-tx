/**
 * begin
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when, undef;

	when = require('when');

	return function create() {
		var tx, preCommit, completed, depth, committers;

		depth = 0;
		committers = [];

		return function begin(run) {
			var result, error, threw;

			if(depth === 0) {
				tx = when.defer();
				preCommit = tx.promise;
				completed = when.defer();
			}

			depth += 1;
			try {
				result = run(tx.promise);
				committers.unshift(result[1]);
			} catch(e) {
				threw = true;
				error = e;
			} finally {
				depth -= 1;
			}

			if(depth === 0) {
				if(threw) {
					abort(tx, error, committers, completed);
				} else {
					commit(tx, result[0], committers, completed);
				}
			}

			committers = undef;

			return completed.promise;
		}
	}

	function commit(tx, transactionResult, committers, completed) {
		return when(transactionResult,
			function (r) {
				tx.resolve();
				return when.settle(committers).then(function (results) {
					var error, failed;
					failed = results.some(function (status) {
						if (status.state === 'rejected') {
							error = status.reason;
							return true;
						}
					});

					if (failed) {
						completed.reject(error);
					} else {
						completed.resolve(r);
					}

					return completed.promise;
				});
			},
			tx.reject
		);
	}

	function abort(tx, error, committers, completed) {
		tx.reject(error).ensure(function () {
			return when.settle(committers).then(function () {
				return completed.reject(error);
			});
		});
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
