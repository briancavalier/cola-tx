/**
 * begin
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when, undef;

	when = require('when');

	return function create(enqueue) {

		return function begin(run) {
			var tx, result;

			tx = when.defer();

			try {
				result = run(tx.promise);
			} catch(e) {
				result = when.reject(e);
				result = [result, result];
			}

			return enqueue(function() {
				complete(tx, result[0], result[1]);
			});
		};
	};

	function complete(tx, bodyResult, committerResult) {
		return when(bodyResult,
			function(result) {
				tx.resolve();
				return when(committerResult).yield(result);
			},
			function(error) {
				tx.reject(error);
				return when(committerResult, function() {
					throw error;
				});
			}
		);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
