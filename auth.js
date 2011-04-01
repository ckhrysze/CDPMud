var util = require('util');
var redis = require('redis');
var db = redis.createClient();
var character = require('./character');

var Auth = function(conn) {
  this.conn = conn;
  this.attempts = 0;
  this.name = "";

  this.login = function() {
    var self = this;
    conn.send('Please enter your character name:');
    conn.once('message', function(msg) { self.nameListener(msg); });
  };

  this.nameListener = function(message) {
    if (message.length < 4) {
      conn.send('Character names must be at least 4 characters');
      this.login();
    } else {
      this.name = message;
      this.pendingPassword();
    }
  };

  this.pendingPassword = function() {
    var self = this;
    conn.send('Please enter your password:');
    conn.once('message', function(msg) { self.passListener(msg); });
  };

  this.passListener = function(message) {
    var self = this;
    db.get('login_' + this.name, function(error, password) {
      if (null != password) {
	// Password set before, validate
	if (password == message) {
	  character.load(self.name, conn);
	} else { // bad password
	  self.attempts += 1;
	  if (self.attempts > 3) {
	    self.conn.send('Too many attempts, bye bye now.');
	    self.conn.close();
	    return;
	  } else {
	    self.conn.send('Invalid password, please try again:');
	    self.pendingPassword();
	  }
	}
      } else { // password not set, new character
	character.create(self.name, message, conn);
      }
    });
  };
};

module.exports = Auth;
