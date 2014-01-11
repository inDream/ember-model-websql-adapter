Ember.WebSQLAdapter = Ember.Adapter.extend({
  dbName: 'websqldb',
  dbVersion: '1.0',
  dbDisplayName: 'WebSQL DB',

  // Size is determined in bytes, will be ignored for Cordova-SQLitePlugin
  dbSize: 5*1024*1024,
  logQueries: false,

  init: function () {
    this._super.apply(this, arguments);
    var cont = window.sqlitePlugin ? window.sqlitePlugin : window;
    this.db = cont.openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbSize);
    var self = this;
    this.db.transaction(
      function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + self.tableName + ' (' + self.structure + ');');
      },
      function (err) {
        console.error(err);
        throw new Error('Database error!');
      },
      function () {
        App.dbCreated = true;
      }
    );
  },

  reset: function () {
    var self = this;
    this.db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS ' + self.tableName);
      },
      function (err) {
        console.error(err);
        throw new Error('Database error!');
      },
      function () {
        self.init();
      });
  },

  find: function (record, id) {
    var tableName = this.tableName;
    var qr = new QueryRapper({id: id}).tableName(tableName);
    return this.query(qr.selectQuery(), function (tx, results) {
      if (results.rows.length) {
        return results.rows.item(0);
      } else {
        throw new Error('Record was not found');
      }
    });
  },

  findAll: function () {
    var tableName = this.tableName;
    var qr = new QueryRapper().tableName(tableName);
    return this.query(qr.selectQuery(), function (tx, results) {
      var data = [];
      for (var i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    });
  },

  findMany: function (klass, records, ids) {
    var tableName = this.tableName;
    var qr = new QueryRapper({id: ids}).tableName(tableName);
    return this.query(qr.selectQuery(), function (tx, results) {
      var data = [];
      for (var i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    });
  },

  findQuery: function (kalss, query) {
    var tableName = this.tableName;
    var qr = new QueryRapper(query).tableName(tableName);
    return this.query(qr.selectQuery(), function (tx, results) {
      var data = [];
      for (var i = 0; i < results.rows.length; i++) {
        data.push(results.rows.item(i));
      }
      return data;
    });
  },

  createRecord: function (record) {
    record = record.get ? record.get("_data") : record;
    var tableName = this.tableName;
    var qr = new QueryRapper().tableName(tableName).values(record);
    return this.query(qr.insertQuery(), function (tx, results) {
      return results;
    });
  },

  saveRecord: function (record) {
    record = record.get ? record.get("_data") : record;
    var tableName = this.tableName;
    var qr = new QueryRapper({id: record.id}).tableName(tableName).values(record);
    return this.query(qr.updateQuery(), function (tx, results) {
      return results;
    });
  },

  deleteRecord: function (record) {
    var tableName = this.tableName;
    var qr = new QueryRapper({id: record.get('id')}).tableName(tableName);
    return this.query(qr.deleteQuery(), function (tx, results) {
      return results;
    });
  },

  logError: function () {
    if (this.logQueries && console && console.error) {
      console.error.apply(console, arguments);
    }
  },

  logInfo: function () {
    if (this.logQueries && console && console.info) {
      console.info.apply(console, arguments);
    }
  },

  query: function (query, callback) {
    var adapter = this;
    this.logInfo('Running query: ' + query);
    return new Ember.RSVP.Promise(function (resolve, reject) {
      adapter.db.transaction(
        function (tx) {
          tx.executeSql(query, [], function (tx, results) {
              var data = callback(tx, results);
              Ember.run(null, resolve, data);
            },
            function (transaction, err) {
              adapter.logError(err, query);
              Ember.run(null, reject, err);
            });
        },
        function (err) {
          adapter.logError(err, query);
          Ember.run(null, reject, err);
          return false;
        }
      );
    });
  }

});
