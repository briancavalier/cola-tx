(function(define) {
define(function(require) {

	var when, undef;

	when = require('when');

	return function create() {
		var tx, depth;

		depth = 0;

		return function begin(run) {

			if(depth === 0) {
				return beginNewTransaction(run);
			} else {
				return runInTransaction(run);
			}

		}

		function beginNewTransaction(run) {
			tx = when.defer();
			return runInTransaction(run);
		}

		function runInTransaction(run) {
			var result, error;

			depth += 1;

			try {
				result = run(tx.promise);
			} catch(e) {
				error = e;
			} finally {
				handleTransactionResult(depth, result, error);
			}

			if(error) {
				throw error;
			}

			return result;
		}

		function handleTransactionResult(depth, result, error) {
			if (isPromiseLike(result)) {
				when(result, end.bind(undef, tx, depth, error), tx.reject.bind(tx));
			} else {
				end(tx, depth, error);
			}

		}

		function end(tx, depth, error) {
			depth;
			if(complete) {
				if(error) {
					tx.reject(error);
				} else {
					tx.resolve();
				}
			}
		}

	}

	function isPromiseLike(x) {
		return Object(x) === x && typeof x.then === 'function';
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
