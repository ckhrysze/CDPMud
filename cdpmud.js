(function() {
  var Auth, mud, server, util;
  util = require("util");
  server = require("./server");
  mud = server.setup();
  Auth = require("./auth");
  mud.addListener("connection", function(conn) {
    conn.send("Welcome to CDP Mud");
    return new Auth(conn).login();
  });
  mud.addListener("close", function(conn) {
    return mud.broadcast("<" + conn.id + "> disconnected");
  });
  mud.listen(8000);
}).call(this);
