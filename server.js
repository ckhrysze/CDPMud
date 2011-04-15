(function() {
  var fs, http, path, setup, sys, ws;
  sys = require("util");
  http = require("http");
  fs = require("fs");
  path = require("path");
  ws = require("websocket-server");
  setup = function() {
    var httpServer, server;
    httpServer = http.createServer(function(req, res) {
      var fullpath, options;
      if (req.method === 'GET') {
        if (req.url.indexOf("favicon") > -1) {
          res.writeHead(200, {
            'Content-Type': 'image/x-icon',
            'Connection': 'close'
          });
          return res.end("");
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Connection': 'close'
          });
          options = {
            flags: "r",
            encoding: "binary",
            mode: 0666,
            bufferSize: 4 * 1024
          };
          fullpath = path.normalize(path.join(__dirname, "client.html"));
          return fs.createReadStream(fullpath, options).addListener("data", function(chunk) {
            return res.write(chunk, "binary");
          }).addListener("end", function() {
            return res.end();
          });
        }
      } else {
        res.writeHead(404);
        return res.end();
      }
    });
    server = ws.createServer({
      server: httpServer
    });
    server.addListener("listening", function() {
      return sys.log("Listening for connections.");
    });
    return server;
  };
  exports.setup = setup;
}).call(this);
