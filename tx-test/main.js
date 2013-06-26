(function(define) {
define(function(require) {

	var meld, txAspect, txBegin, pojoObserver, joinpointObserver, createObserver;

	meld = require('meld');
	txAspect = require('./tx/aspect');
	txBegin = require('./tx/begin');
	pojoObserver = require('./observer/pojoObserver');
	joinpointObserver = require('./observer/joinpointObserver');

	createObserver = pojoObserver.bind(null, function(changes) {
		console.log('COMMIT----------------------------------');
		changes.forEach(function(item) {
			console.log(JSON.stringify(item));
		});
		console.log('----------------------------------------');
	}, jsonDiff);

	function objectTest() {
		var data, person, observer, aspect, begin, thing;

		data = { id: 1, name: 'Brian' };

		person = new Person(data);

		observer = createObserver([data]);
		begin = txBegin();
		aspect = txAspect(begin, joinpointObserver(observer));

		thing = new Thing(person);

		meld(person, 'setName', aspect);
//		meld(thing, 'setName', aspect);

		thing.setName('John');
	}

	function arrayTest() {
		// TODO
	}

	function Thing(person) {
		this.person = person;
	}

	Thing.prototype = {
		setName: function(name) {
			this.person.setName(name);
			return this;
		}
	};

	function Person(data) {
		this.data = data;
	}

	Person.prototype = {
		setName: function(name) {
			this.data.name = name;
			return this;
		}
	}

	function jsonDiff(previousValue) {
		var previousValue = JSON.stringify(previousValue);
		return function(newValue) {
			return previousValue !== JSON.stringify(newValue);
		}
	}

	return function() {
		objectTest();
		arrayTest();
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
