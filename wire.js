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

	var when, txAspect, txBegin, diffArray, diffObject,
		joinpointObserver, createObserver, observer, collectionUpdaters;

	when = require('when');

	txAspect = require('./advisor/aspect');
	joinpointObserver = require('./advisor/joinpointObserver');

	txBegin = require('./tx/begin');
	createObserver = require('./tx/changeObserver');
	diffArray = require('./diff/array');
	diffObject = require('./diff/object');

	collectionUpdaters = {
		new: function(collection, change) {
			collection.add(change.object[change.index]);
		},
		updated: function(collection, change) {
			collection.update(change.object[change.index]);
		},
		deleted: function(collection, change) {
			collection.remove(change.oldValue);
		}
	};

	function syncCollection(collection, changes) {
		return changes.reduce(function(collection, change) {
			var updater = collectionUpdaters[change.type];
			if(updater) {
				updater(collection, change);
			}

			return collection;
		}, collection);
	}

	function syncCollectionHandler(collection, tx, changes) {
		return tx.then(function() {
			return syncCollection(collection, changes);
		});
	}

	return function(options) {
		var aspects = [];

		if(!options) {
			options = {};
		}

		function doBind(proxy, to, options, wire) {

			return wire(options).then(bindTx);

			function bindTx(options) {
				var pointcut, observers, aspect;

				pointcut = options.methods || /^[^_]/;
				observers = options.notify;

				observer = joinpointObserver([
					{
						test: function(candidate) {
							return candidate === proxy.get(to);
						},
						observer: createObserver(diffArray(diffObject),
							syncObservers)
					}
				]);

				aspect = txAspect(txBegin(), observer);
				aspects.push(proxy.advise(pointcut, aspect));

				function syncObservers(tx, changes) {
					return when.map(observers, function(observer) {
						if(typeof observer === 'function') {
							return tx.then(function() {
								return proxy.invoke(observer, [changes]);
							});
						}

						return syncCollectionHandler(observer, tx, changes);
					});
				}
			}
		}

		function bindFacet(resolver, proxy, wire) {
			var promise = when.all(Object.keys(proxy.options)
				.map(function(key) {
					return doBind(proxy, key, proxy.options[key], wire);
				})
			);

			resolver.resolve(promise);
		}

		return {
			context: {
				destroy: function(resolver) {
					aspects.forEach(function(aspect) {
						aspect.remove();
					});
					resolver.resolve();
				}
			},
			facets: {
				bind: {
					'connect:before': bindFacet
				}
			}
		};

	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
