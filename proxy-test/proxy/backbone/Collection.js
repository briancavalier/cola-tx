/**
 * Collection
 * @author: brian
 */
(function(define) {
define(function(require) {

	var when, eventify, Collection, defaultIdentifier;

	when = require('when');
	eventify = require('../../eventify');
	defaultIdentifier = require('cola/identifier/default');
	Collection = require('backbone').Collection;

	function BackboneCollection(collection) {
		this._collection = collection;

		var self = this;
		collection.on('add', function(model) {
			self._emit('onAdd', model.attributes);
		});
		collection.on('remove', function(model) {
			self._emit('onRemove', model.attributes);
		});
	}

	BackboneCollection.prototype = eventify(['onAdd', 'onRemove', 'onUpdate'], {

		identifier: defaultIdentifier,

		forEach: function(lambda) {
			return this._collection.forEach(function(item) {
				lambda(item.attributes);
			});
		},

		add: function(item) {
			return when(this._collection.create(item)).yield(item);
		},

		update: function(item) {
			var model = this._collection.get(item);
			if(model) {
				model.set(item);
				return when(model.save()).yield(model.attributes);
			}
		},

		remove: function(itemOrId) {
			var item = this._collection.get(itemOrId);
			if(item) {
				this._collection.remove(itemOrId);
				return item.attributes;
			}
		}
	});

	BackboneCollection.canHandle = function(it) {
		return it instanceof Collection;
	}

	return BackboneCollection;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
