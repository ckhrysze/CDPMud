(function() {
  var Auth, character, db, redis, util;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  util = require('util');
  redis = require('redis');
  db = redis.createClient();
  character = require('./character');
  Auth = (function() {
    function Auth(conn) {
      this.conn = conn;
      this.attempts = 0;
      this.name = "";
    }
    Auth.prototype.login = function() {
      this.conn.send('Please enter your character name:');
      return this.conn.once('message', __bind(function(msg) {
        return this.nameListener(msg);
      }, this));
    };
    Auth.prototype.nameListener = function(message) {
      if (message.length < 4) {
        this.conn.send('Character names must be at least 4 characters');
        return this.login();
      } else {
        this.name = message;
        return this.pendingPassword();
      }
    };
    Auth.prototype.pendingPassword = function() {
      this.conn.send('Please enter your password:');
      return this.conn.once('message', __bind(function(msg) {
        return this.passListener(msg);
      }, this));
    };
    Auth.prototype.passListener = function(message) {
      return db.get('login_' + this.name, __bind(function(error, password) {
        if (password != null) {
          if (password === message) {
            return character.load(this.name, this.conn);
          } else {
            this.attempts += 1;
            if (this.attempts > 3) {
              this.conn.send('Too many attempts, bye bye now.');
              this.conn.close();
              return 0;
            } else {
              this.conn.send('Invalid password, please try again:');
              return this.pendingPassword();
            }
          }
        } else {
          return character.create(this.name, message, this.conn);
        }
      }, this));
    };
    return Auth;
  })();
  module.exports = Auth;
}).call(this);
