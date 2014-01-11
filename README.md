# Ember.Model WebSQL Adapter

This is a modified version of [eltiare/ember-websql-storage] for Ember.Model.  
You can use it with WebSQL in browser or [lite4cordova/Cordova-SQLitePlugin] in Phonegap App.

[eltiare/ember-websql-storage]: https://github.com/eltiare/ember-websql-storage
[lite4cordova/Cordova-SQLitePlugin]: https://github.com/lite4cordova/Cordova-SQLitePlugin


Demo is coming soon.

## Usage
- Add **query-rapper.js** ( [eltiare/query-rapper] ) and **ember-model-websql-adapter.js**
- Use `Ember.WebSQLAdapter` as the model's adapter 

[eltiare/query-rapper]: https://github.com/eltiare/query-rapper

## Options
  - `dbName` - Database name
  - `tableName` - Table name
  - `structure` - SQL structure for this table (Todo: auto convert from model's properties)
  - `logQueries` - Log transaction queries

## Adapter API
Access via App.[Model].adapter:
  - `reset` - Reset Database

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
