(function(define) {
define(function(require) {

	var mappedChangeObserver = require('./mapChangeObserver');

	return function wrapObserver(property, observer) {
		return mappedChangeObserver(function(x) {
			return x[property];
		}, observer);
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
