var meld, txAspect, txBegin, diffObject, joinpointObserver, createObserver, observer;

meld = require('meld');

txAspect = require('./advisor/aspect');
joinpointObserver = require('./advisor/joinpointObserver');

txBegin = require('./tx/begin');
createObserver = require('./tx/changeObserver' +
	'');
diffObject = require('./diff/object');

function handler(tx, changes) {
	return tx.then(function() {
		if (changes) {
			console.log('COMMIT----------------------------------');
			console.log(JSON.stringify(changes, null, '  '));
			console.log('----------------------------------------');
		}
	}, function(e) {
		console.error(e.stack);
		throw e;
	});
}

observer = createObserver(diffObject, handler);

function objectTest() {
	var data, person, aspect, begin, thing;

	data = { id: 1, name: 'Brian' };

	person = new Person(data);

	observer = joinpointObserver([{ value: data, observer: observer(data) }]);
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
