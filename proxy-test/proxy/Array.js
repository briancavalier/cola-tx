/**
 * Array
 * @author: brian
 */
(function(define) {
define(function(require) {

	var meld, defaultIdentifier, eventify, bind, uncurryThis, forEach, push, splice;

	meld = require('meld');
	defaultIdentifier = require('cola/identifier/default');
	eventify = require('../eventify');

	bind = Function.prototype.bind;
	uncurryThis = bind.bind(bind.call);
	forEach = uncurryThis(Array.prototype.forEach);
	push = uncurryThis(Array.prototype.push);
	splice = uncurryThis(Array.prototype.splice);

	function proxyArray(array) {
		var p = new ArrayProxy(array);

		meld.on(array, ['push', 'unshift'], function() {
			forEach(arguments, function(item) {
				p.add(item);
			});
		});

		meld.afterReturning(array, ['pop', 'shift'], function(item) {
			p.remove(item);
		});

		// TODO: splice

		meld.on(p, 'onAdd', function(item) {
			var index = findIndex(array, p.identifier, p.identifier(item));
			if(index === -1) {
				push(array, item);
			}
		});

		meld.on(p, 'onUpdate', function(item) {
			var index = findIndex(array, p.identifier, p.identifier(item));
			if(index >= 0) {
				splice(array, index, 1);
			}
			push(array, item);
		});

		meld.on(p, 'onRemove', function(item) {
			var index = findIndex(array, p.identifier, p.identifier(item));
			if(index >= 0) {
				splice(array, index, 1);
			}
		});

		return p;
	}

	function findIndex(array, identifier, id) {
		var index = -1;
		array.some(function(item, i) {
			var itemId = identifier(item);
			if(id === itemId) {
				index = i;
				return true;
			}
		});

		return index;
	}

	function ArrayProxy(array) {
		this._data = array.slice();
		this._index = {};
		array.forEach(this.add.bind(this));
	}

	ArrayProxy.prototype = eventify(['onAdd', 'onRemove', 'onUpdate'], {

		identifier: defaultIdentifier,

		forEach: function(lambda) {
			this._data.forEach(function(item) {
				lambda(item);
			});
		},

		add: function(item) {
			var key, index;

			key = this.identifier(item);
			index = this._index;

			if(key in index) return null;

			index[key] = push(this._data, item) - 1;
			this._emit('onAdd', item);

			return index[key];
		},

		remove: function(itemOrId) {
			var key, at, index, data;

			key = this.identifier(itemOrId);
			index = this._index;

			if(!(key in index)) return null;

			data = this._data;
			at = index[key];

			this._emit('onRemove', data[at]);

			splice(data, at, 1);

			// Rebuild index
			this._index = buildIndex(data, this.identifier);

			return at;
		},

		update: function (item) {
			var key, at, index;

			key = this.identifier(item);
			index = this._index;

			at = index[key];

			if (at >= 0) {
				splice(this._data, at, 1, item);
				this._emit('onAdd', item);
			}
			else {
				index[key] = push(this._data, item) - 1;
				this._emit('onUpdate', item);
			}

			return at;
		},

		get: function(id) {
			return this._data(this._index[id]);
		},

		clear: function() {
			var self = this;

			forEach(this._data, function(item) {
				self._emit('onRemove', item);
			});

			this._data = [];
			this._index = {};
		}
	});

	function buildIndex(items, keyFunc) {
		return items.reduce(function(index, item, i) {
			index[keyFunc(item)] = i;
			return index;
		}, {});
	}

	return proxyArray;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
