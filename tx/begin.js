/**
 * begin
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when = require('when');

	return function create(enqueue) {

		return function begin(run) {
			var result;

			try {
				result = run();
			} catch(e) {
				result = [when.reject(e), identity];
			}

			return enqueue(function() {
				complete(result[0], result[1]);
			});
		};
	};

	function complete(bodyResult, committer) {
		return when(bodyResult,
			function(result) {
				return when(committer(when.resolve())).yield(result);
			},
			function(error) {
				return when(committer(when.reject(error)), function() {
					throw error;
				});
			}
		);
	}

	function identity(x) { return x; }

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
