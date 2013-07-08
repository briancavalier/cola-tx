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

	function LocalStorage(namespace, localStorage) {
		this._namespace = namespace;
		this._storage = localStorage || window.localStorage;
	}

	LocalStorage.prototype = {
		/**
		 * @param {object?} options
		 * @returns {*}
		 */
		fetch: function(options) {
			var data = this._storage.getItem(this._namespace);
			return data == null ? [] : JSON.parse(data);
		},

		save: function(changes) {
			if(!changes) return;
			this.set(updateArray(this.fetch(), changes));
		},

		set: function(data) {
			this._storage.setItem(this._namespace, JSON.stringify(data));
		}

	};

	return LocalStorage;

});
})(typeof define == 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }
);
