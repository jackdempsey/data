require('ember-data/adapters/localStorage_adapter');

var get = SC.get, set = SC.set;

var adapter, store;
var Person, person, people;
var Role, role, roles;

localStorage.clear();

module("the localStorage adapter", {
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

test("creating a person makes a save to localStorage, with the data", function() {
  set(adapter, 'bulkCommit', false);

  person = store.createRecord(Person, {name: "Tom Dale"});

  expectState('new');
  store.commit();
  
  expectState('saving', false);
  equal(person, store.find(Person, 1), 'it is now possible to retrieve the person by the ID supplied')

});

test("updating a person makes a save to the same key with the new data", function() {
  set(adapter, 'bulkCommit', false);

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
});