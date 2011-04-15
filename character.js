(function() {
  var Character, db, redis, util;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  util = require('util');
  redis = require('redis');
  db = redis.createClient();
  Character = (function() {
    function Character(name, conn) {
      this.name = name;
      this.conn = conn;
      this.conn.addListener('message', __bind(function(message) {
        return this.conn.send("Logged in as: " + this.name);
      }, this));
    }
    return Character;
  })();
  exports.load = function(name, conn) {
    return conn.send("Welcome back,  " + name);
  };
  exports.create = function(name, password, conn) {
    db.set('login_' + name, password);
    conn.send("Created character " + name + " with password " + password);
    return conn.addListener("message", function(message) {
      return conn.send("Unrecognized command: " + message);
    });
  };
}).call(this);
