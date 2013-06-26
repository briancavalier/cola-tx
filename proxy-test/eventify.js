/**
 * eventify
 * @author: brian
 */
(function(define) {
define(function() {

	return eventify;

	function eventify(events, object) {
		object._emit = function(event, data) {
			async(this[event].bind(this, data));
		};

		return events.reduce(function(target, event) {
			target[event] = function(data) {};
			return target;
		}, object);
	}

	function async(f) {
		setTimeout(f, 0);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
