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
    conn.addListener('message', function(msg) { self.nameListener(msg); });
  };

  this.nameListener = function(message) {
    if (message.length < 4) {
      conn.send('Character names must be at least 4 characters');
    } else {
      this.name = message;
      conn.removeListener('message', this.nameListener);
      this.pendingPassword();
    }
  };

  this.pendingPassword = function() {
    var self = this;
    conn.send('Please enter your password:');
    conn.addListener('message', function(msg) { self.passListener(msg); });
  };

  this.passListener = function(message) {
    db.get('login_' + name, function(error, password) {
      if (null != password) {
	// Password set before, validate
	if (password == message) {
	  conn.removeListener('message', this.passListener);
	  character.load(name, conn);
	} else { // bad password
	  attempts += 1;
	  if (attempts > 3) {
	    conn.send('Too many attempts, bye bye now.');
	    conn.close();
	  } else {
	    conn.send('Invalid password, please try again:');
	  }
	}
      } else { // password not set, new character
	conn.removeListener('message', this.passListener);
	character.create(name, conn);
      }
    });
  };
};

module.exports = Auth;
