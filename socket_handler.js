var sys = require("sys")
  , redis = require("redis")
  , client = redis.createClient();

this.handler = function(conn) {
  client.set("username", "user_"+conn.id);

  conn.send("** Connected as: user_"+conn.id);
  conn.send("** Type `/nick USERNAME` to change your username");

  conn.broadcast("** "+client.get("username")+" connected");

  conn.addListener("message", function(message){
    if(message[0] == "/"){
      // set username
      if((matches = message.match(/^\/nick (\w+)$/i)) && matches[1]){
        client.set("username", matches[1]);
        conn.send("** you are now known as: "+matches[1]);

      // get message count
      } else if(/^\/stats/.test(message)){
        conn.send("** you have sent "+client.get("messages", 0)+" messages.");
      }
    } else {
      client.incr("messages");
      server.broadcast(client.get("username")+": "+message);
    }
  });
}