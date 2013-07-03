/**
 * queue
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when = require('when');

	return function createQueue() {
		var queue;

		return function(task) {
			task = run(task);
			return queue = when(queue, task, task);
		};
	};

	function run(task) {
		return function() {
			return task();
		};
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
