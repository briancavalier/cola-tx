(function(define) {
define(function() {

	return function(begin, observer) {
		return function(run) {
			var args, self;

			self = this;
			args = Array.prototype.slice.call(arguments, 1);

			return begin(function(tx) {
				observer(tx);

				return run.apply(self, args);
			});
		};
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
