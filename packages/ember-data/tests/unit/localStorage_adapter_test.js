require('ember-data/adapters/localStorage_adapter');

var get = Ember.get, set = Ember.set;

var adapter, store;
var Person, person, people;
var Role, role, roles;

localStorage.clear();

module("DS.localStorage-adapter", {
  setup: function() {
    adapter = DS.localStorageAdapter.create();

    store = DS.Store.create({
      adapter: adapter
    });

    Person = DS.Model.extend({
      name: DS.attr('string')
    })
    Person.toString = function() {
      return "App.Person";
    }

    Role = DS.Model.extend({
      name: DS.attr('string'),
      primaryKey: '_id'
    })
    Role.toString = function() {
      return "App.Role";
    }
  },
  teardown: function() {
    adapter.destroy();
    store.destroy();

    if (person) { person.destroy(); }
  }
});

var expectState = function(state, value, p) {
  p = p || person;

  if (value === undefined) { value = true; }

  var flag = "is" + state.charAt(0).toUpperCase() + state.substr(1);
  equal(get(p, flag), value, "the person is " + (value === false ? "not " : "") + state);
};

/*

Creating

*/

test("creating a person makes a save to localStorage, with the data", function() {
  //set(adapter, 'bulkCommit', false);

  person = store.createRecord(Person, {name: "Tom Dale"});

  expectState('new');
  store.commit();
  
  expectState('saving', false);
  equal(person, store.find(Person, 1), 'it is now possible to retrieve the person by the ID supplied')

});

/*

Updating

*/

test("updating a person makes a save to the same key with the new data", function() {
  //set(adapter, 'bulkCommit', false);

  store.load(Person, { id: 1, name: "Yehuda Katz" });

  person = store.find(Person, 1);

  expectState('new', false);
  expectState('loaded');
  expectState('dirty', false);

  set(person, 'name', "Brohuda Brokatz");

  expectState('dirty');
  store.commit();
  expectState('saving', false);

  equal(person, store.find(Person, 1), "the same person is retrieved by the same ID");
  equal(get(person, 'name'), "Brohuda Brokatz", "the hash should be updated");
});

test("updates are not required to return data", function() {
});

test("updating a record with custom primaryKey", function() {
});

/*

Deleting

*/

test("deleting a person deletes the appropriate record", function() {
});

test("deleting a record with custom primaryKey", function() {
});

/*

Finding

*/

test("finding all people makes a GET to /people", function() {
});

test("finding a person by ID makes a GET to /people/:id", function() {
});

test("finding many people by a list of IDs", function() {
});

test("finding people by a query", function() {
});

/*

Creating, updating, and deleting with bulkCommit

*/

test("creating several people (with bulkCommit) makes a POST to /people, with a data hash Array", function() {
});

test("updating several people (with bulkCommit) makes a PUT to /people/bulk with the data hash Array", function() {
});

test("deleting several people (with bulkCommit) makes a PUT to /people/bulk", function() {
});