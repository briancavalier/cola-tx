(function(define) {
define(function(require) {

	var meld, txAspect, txBegin, pojoObserver, joinpointObserver;

	meld = require('meld');
	txAspect = require('./tx/aspect');
	txBegin = require('./tx/begin');
	pojoObserver = require('./observer/pojoObserver');
	joinpointObserver = require('./observer/joinpointObserver');

	function run() {
		var data, person, observer, aspect, begin, thing1, thing2;

		data = [
			{ id: 1, name: 'Brian' }
		];

		person = { id: 2, name: 'John' };

		observer = pojoObserver(function(changes) {
			console.log('COMMIT----------------------------------');
			changes.forEach(function(item) {
				console.log(JSON.stringify(item));
			});
			console.log('----------------------------------------');
		}, jsonDiff, [data, person]);
		begin = txBegin();
		aspect = txAspect(begin, joinpointObserver(observer));

		thing1 = new Thing1(data);
		thing2 = new Thing2(person);

		meld(thing1, 'add', aspect);
		meld(thing2, 'setName', aspect);

		thing1.add(person);

		thing2.setName('Scott');
	}

	function Thing1(data) {
		this.data = data;
	}

	Thing1.prototype = {
		add: function(person) {
			this.data.push(person);
			return this.data.length;
		}
	};

	function Thing2(person) {
		this.person = person;
	}

	Thing2.prototype = {
		setName: function(name) {
			this.person.name = name;
		}
	};

	function jsonDiff(previousValue) {
		var previousValue = JSON.stringify(previousValue);
		return function(newValue) {
			return previousValue !== JSON.stringify(newValue);
		}
	}

	return run;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
