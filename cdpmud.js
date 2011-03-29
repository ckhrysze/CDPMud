var util = require("util")
  , server = require("./server")
  , redis = require("redis")
  , db = redis.createClient();

function pendingCharacterName(conn) {
  conn.send("Please enter your character name:");

  conn.addListener("message", function(message) {
    if (message.length < 4) {
      conn.send("Character names must be at least 4 characters");
    } else {
      conn.removeAllListeners();
      pendingPassword(message, conn);
    }
  });
}

function pendingPassword(name, conn) {
  conn.send("Please enter your password:");

  conn.addListener("message", function(message) {
    db.get("character" + name, function(error, password) {
	if (null == password) {
	    // WIP: Confirm new character
	}
    });
  });
}

var mud = server.setup();

// Handle WebSocket Requests
mud.addListener("connection", function(conn) {

  conn.send("Welcome to CDP Mud");

  pendingCharacterName(conn);
});

mud.addListener("close", function(conn){
  mud.broadcast("<"+conn.id+"> disconnected");
});

mud.listen(8000);