var util = require("util");
var server = require("./server");

var mud = server.setup();

var Auth = require("./auth");

// Handle WebSocket Requests
mud.addListener("connection", function(conn) {
  conn.send("Welcome to CDP Mud");
  new Auth(conn).login();
});

mud.addListener("close", function(conn){
  mud.broadcast("<"+conn.id+"> disconnected");
});

mud.listen(8000);