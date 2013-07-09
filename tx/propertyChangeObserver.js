(function(define) {
define(function(require) {

	var mappedChangeObserver = require('./mappedObserver');

	return function wrapObserver(property, prepareDiff, handler) {
		return mappedChangeObserver(function(x) {
			return x[property];
		}, prepareDiff, handler);
	};
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
