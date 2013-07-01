var meld, txAspect, txBegin, diffObject, objectObserver, createObserver;

meld = require('meld');
txAspect = require('./tx/aspect');
txBegin = require('./tx/begin');
objectObserver = require('./observer/observer');
diffObject = require('./diff/object');

createObserver = objectObserver.bind(null, function(object) {
	var diff = diffObject(object);

	return function(tx) {
		tx.then(function() {
			var changes = diff(object);
			if(changes) {
				console.log('COMMIT----------------------------------');
				console.log(JSON.stringify(changes, null, '  '));
				console.log('----------------------------------------');
			}
		});
	}
});

function objectTest() {
	var data, person, observer, aspect, begin, thing;

	data = { id: 1, name: 'Brian' };

	person = new Person(data);

	observer = createObserver(data);
	begin = txBegin();
	aspect = txAspect(begin, observer);

	thing = new Thing(person);

	meld(person, 'setName', aspect);

	thing.setName('John');
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

objectTest();
