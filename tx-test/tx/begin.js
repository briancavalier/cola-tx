/**
 * begin
 * @author: brian
 */
(function(define) {
define(function(require) {

	var defer = require('when').defer;

	return function create() {
		var tx, depth;

		depth = 0;

		return function begin(run) {
			var result, error;

			if(depth === 0) {
				tx = defer();
			}

			depth += 1;
			try {
				result = run(tx.promise);
			} catch(e) {
				error = e;
			} finally {
				depth -= 1;
			}

			if(depth === 0) {
				if(error) {
					tx.reject(error);
				} else {
					tx.resolve();
				}
			}
		}

	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
