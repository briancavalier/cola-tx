var meld, txAspect, txBegin, diffArray, diffObject, joinpointObserver, createObserver, propertyChangeObserver, observer;

meld = require('meld');

txAspect = require('./advisor/aspect');
joinpointObserver = require('./advisor/joinpointObserver');

txBegin = require('./tx/begin');
createObserver = require('./tx/changeObserver');
propertyChangeObserver = require('./tx/propertyChangeObserver');
diffArray = require('./diff/array');
diffObject = require('./diff/object');

function handler(tx, changes) {
	return tx.then(function() {
		if(changes) {
			console.log('COMMIT----------------------------------');
			console.log(JSON.stringify(changes, null, '  '));
			console.log('----------------------------------------');
		}
	}, function(e) {
		console.error(e.stack);
		throw e;
	});
}

observer = createObserver(diffArray(diffObject), handler);

function arrayPropertyTest() {
	var data, aspect, begin, thing;

	data = [
		{ id: 1, name: 'John' },
		{ id: 2, name: 'Brian' },
		{ id: 3, name: 'Scott' }
	];

	observer = joinpointObserver([{ test: function(x) { return x === data; }, observer: observer }]);
	begin = txBegin();
	aspect = txAspect(begin, observer);

	thing = new Thing(data);

	meld(thing, 'doStuff', aspect);

	thing.doStuff();
}

function Thing(people) {
	this.people = people;
}

Thing.prototype = {
	doStuff: function() {
		this.people = this.people.filter(function(person) {
			return person.name != 'Brian';
		});
	}
};

arrayPropertyTest();
