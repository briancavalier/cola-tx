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

	var update = require('./update');

	return update({
		new: function(array, index, item) {
			var existing = array[index];
			if(!(existing && existing.id == item.id)) {
				array.splice(index, 0, item);
			}
		},
		updated: function(array, index, item) {
			array[index] = item;
		},
		deleted: function(array, index) {
			array.splice(index, 1);
		}
	});

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
