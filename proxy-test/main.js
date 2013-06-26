define(function(require) {

	var meld, proxyArray, NodeList, PersonCollection, Person,
		BackboneLocalStorage, CollectionProxy, byName, form;

	meld = require('meld');
	proxyArray = require('./proxy/Array');
	NodeList = require('./proxy/NodeList');
	CollectionProxy = require('./proxy/backbone/Collection');
	byName = require('cola/comparator/byProperty')('name');
	form = require('cola/dom/form');

	BackboneLocalStorage = require('backbone/LocalStorage');
	Person = require('./Person');
	PersonCollection = require('./PersonCollection');

	return function() {
		var people, peopleProxy, personListNode, personList, id;

		id = 1;

//	people = [
//		{ id: id++, name: 'Brian' }
//	];
//
//	peopleProxy = proxyArray(people);

		people = new PersonCollection();
		people.model = Person;
		people.localStorage = new BackboneLocalStorage('backbone-test-people');
		people.fetch();

		peopleProxy = new CollectionProxy(people);

		meld.on(peopleProxy, 'onAdd', function(item) {
			console.log('added', item, people);
		});

		people.push({ id: id++, name: 'John' });

		personListNode = qs('.person-list');
		personList = new NodeList(personListNode, {
			identifier: peopleProxy.identifier,
			comparator: byName,
			querySelector: qs,
			bindings: {
				name: '.name'
			}
		});

		personListNode.addEventListener('click', function(e) {
			if(e.target.classList.contains('remove')) {
				peopleProxy.remove(personList.findItem(e));
			}
		});

		peopleProxy.forEach(personList.add.bind(personList));

		meld.around(peopleProxy, /^on[A-Z]\S+/, function(jp) {
			var m, result;

			result = jp.proceed();

			m = jp.method[2].toLowerCase() + jp.method.slice(3);
			personList[m].apply(personList, jp.args);

			return result;
		});

		people.push({ id: id++, name: 'Scott' });

		qs('.person-add').addEventListener('submit', function(e) {
			e.preventDefault();

			var person = form.getValues(e.target);
			person.id = id++;
			peopleProxy.add(person); // or a.push
		});
	}


	function qs(selector, node) {
		return (node||document).querySelector(selector);
	}

});