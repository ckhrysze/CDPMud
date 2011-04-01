var util = require('util');
var redis = require('redis');
var db = redis.createClient();

var Character = function(name, conn) {
  this.name = name;
  this.conn = conn;
  this.conn.addListener("message", function(message) {
    conn.send("Logged in as: " + this.name);
  });
};

exports.load = function(name, conn) {
  conn.send("Welcome back,  " + name);
  //new Character(name, conn);
};

exports.create = function(name, password, conn) {
  db.set('login_' + name, password);
  conn.send("Created character " + name + " with password " + password);
  conn.addListener("message", function(message) {
    conn.send("Unrecognized command: " + message);
  });
};
