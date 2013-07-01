var meld, txAspect, txBegin, diffArray, diffObject, objectObserver, createObserver;

meld = require('meld');
txAspect = require('./tx/aspect');
txBegin = require('./tx/begin');
objectObserver = require('./observer/observer');
diffArray = require('./diff/array');
diffObject = require('./diff/object');

createObserver = objectObserver.bind(null, function(array) {
	var diff = diffArray(diffObject)(array);

	return function(tx) {
		return tx.then(function() {
			var changes = diff(array);
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
});

function arrayTest() {
	var data, observer, aspect, begin, thing;

	data = [
		{ id: 1, name: 'John' },
		{ id: 2, name: 'Brian' },
		{ id: 3, name: 'Scott' }
	];

	observer = createObserver(data);
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
		this.people.push({ id: 4, name: 'Jeremy' });
		this.people.shift();
		this.people[0].name = 'Frank';
	}
};

arrayTest();
