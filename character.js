var Character = function(name, conn) {
  this.name = name;
  this.conn = conn;
  this.conn.addListener("message", function(message) {
    conn.send("Logged in as: " + this.name);
  });
};

exports.load = function(name, conn) {
  new Character(name, conn);
};

exports.create = function(name, conn) {
  conn.send("Created character: " + name);
  conn.addListener("message", function(message) {
    conn.send("Unrecognized command: " + message);
  });
};
