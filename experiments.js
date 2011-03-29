var util = require("util")
  , http = require("http")
  , fs = require("fs")
  , path = require("path")
  , ws = require("websocket-server")
  , redis = require("redis")
  , client = redis.createClient();

var Room = require('./room');
util.log(Room);

var first_room = new Room("title", "description", ['e', 'w']);
util.log(first_room.display());


util.log("asdf".length);

process.exit();