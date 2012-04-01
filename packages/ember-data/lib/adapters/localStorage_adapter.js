var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

DS.localStorageAdapter = DS.Adapter.extend({
  createRecord: function(store, type, model) {
    var records = this.storage.get(type);
    var id = records.length + 1;
    model.set('id', id)

    var data = model.toJSON();
    records[id] = data;

    this.storage.set(type, records);
    store.didCreateRecord(model, data);
  },
  updateRecord: function(store, type, model) {
    var id = get(model, 'id');
    var data = model.toJSON();

    var records = this.storage.get(type);
    records[id] = data;

    this.storage.set(type, records);
    store.didUpdateRecord(model, data);
  },

  find: function(store, type, id) {
    var records = this.storage.get(type);
    store.load(type, id, records[id]);
  },

  findAll: function(store, type) {
    var records = this.storage.get(type);

    if (records) {
      store.loadMany(type, records)
    }
  },


  storage: {
    set: function(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
      var value = localStorage.getItem(key);
      value = JSON.parse(value) || [];
      return value;
    }
  }
});