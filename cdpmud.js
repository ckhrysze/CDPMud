var sys = require("util")
  , http = require("http")
  , fs = require("fs")
  , path = require("path")
  , ws = require("websocket-server")
  , redis = require("redis")
  , client = redis.createClient();

var httpServer = http.createServer(function(req, res){
  if(req.method == "GET"){
    if( req.url.indexOf("favicon") > -1 ){
      res.writeHead(200, {'Content-Type': 'image/x-icon', 'Connection': 'close'});
      res.end("");
    } else {
      res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'close'});
      fs.createReadStream( path.normalize(path.join(__dirname, "client.html")), {
        'flags': 'r',
        'encoding': 'binary',
        'mode': 0666,
        'bufferSize': 4 * 1024
      }).addListener("data", function(chunk){
        res.write(chunk, 'binary');
      }).addListener("end",function() {
        res.end();
      });
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});


var server = ws.createServer({
  server: httpServer
});

server.addListener("listening", function(){
  sys.log("Listening for connections.");
});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
  var user_key = "user_"+conn.id;
  sys.log(user_key);
  client.set(user_key, user_key, redis.print);
  client.get(user_key, redis.print);

  client.set(user_key+"_messages", 0, redis.print);

  conn.send("** Connected as: user_"+conn.id);
  conn.send("** Type `/nick USERNAME` to change your username");

  client.get(user_key, function(err, username) {
    server.broadcast("** "+ username + " connected");
  });

  conn.addListener("message", function(message){
    if(message[0] == "/"){
      // set username
      if((matches = message.match(/^\/nick (\w+)$/i)) && matches[1]){
	client.set(user_key, matches[1], redis.print);
	conn.send("** you are now known as: " + matches[1]);
	// get message count
      } else if(/^\/stats/.test(message)){
	client.get(user_key+"messages", function(err, count) {
	  conn.send("** you have sent " + count + " messages.");
	});
      }
    } else {
      client.incr(user_key+"messages", redis.print);
      client.get(user_key, function(err, username) {
	server.broadcast(username + ": " + message);
      });
    }
  });
});

server.addListener("close", function(conn){
  server.broadcast("<"+conn.id+"> disconnected");
});

server.listen(8000);