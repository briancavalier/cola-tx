/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 */

(function(define) { 'use strict';
define(function(require) {

	var updateArray = require('./updateArray');

	function ArrayStorage(array) {
		this.set(array);
	}

	ArrayStorage.prototype = {
		fetch: function(options) {
			return this._array.slice();
		},

		save: function(changes) {
			this._array = updateArray(this.array, changes);
		},

		set: function(data) {
			this._array = data || [];
		}
	};

	return ArrayStorage;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
