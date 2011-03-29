var util = require("util")
  , server = require("./server")
  , redis = require("redis")
  , db = redis.createClient()
  , character = require("./character")
;

function pendingCharacterName(conn) {
  conn.send("Please enter your character name:");

  conn.addListener("message", function(message) {
    if (message.length < 4) {
      conn.send("Character names must be at least 4 characters");
    } else {
      conn.removeAllListeners("message");
      pendingPassword(message, conn);
    }
  });
}

function pendingPassword(name, conn) {
  conn.send("Please enter your password:");
  var attempts = 0;
  conn.addListener("message", function(message) {
    db.get("login_" + name, function(error, password) {
      if (null != password) {
	// Password set before, validate
	if (password == message) {
	  conn.removeAllListeners("message");
	  character.load(name, conn);
	} else { // bad password
	  attempts += 1;
	  if (attempts > 3) {
	    conn.send("Too many attempts, bye bye now.");
	    conn.close();
	  } else {
	    conn.send("Invalid password, please try again:");
	  }
	}
      } else { // password not set, new character
	conn.removeAllListeners("message");
	character.create(name, conn);
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