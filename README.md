# Ember.Model WebSQL Adapter

This is a modify version of eltiare/ember-websql-storage for using Ember.Model with WebSQL or lite4cordova/Cordova-SQLitePlugin .

Demo is coming soon.

## Usage
- Add query-rapper.js and ember-model-websql-adapter.js
- Use `Ember.WebSQLAdapter` as the model's adapter

## Options
  - `dbName` - Database name
  - `tableName` - Table name
  - `structure` - SQL structure for this table (Todo: auto convert from model's properties)
  - `logQueries` - Log query for transactions

## Example
```javascript
App.Notice = Em.Model.extend({
  id: Em.attr(Number),
  body: Em.attr(),
});

App.Post.adapter = Ember.WebSQLAdapter.create({
  dbName: "App",
  tableName: "Notice",
  structure:
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    '"body" TEXT'
});

// Use Ember.Model's API: https://github.com/ebryn/ember-model#model-api
// App.Post.create({body: "test").save();
// ...
```
