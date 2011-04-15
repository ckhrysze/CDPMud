sys = require("util")
http = require("http")
fs = require("fs")
path = require("path")
ws = require("websocket-server")

setup = () ->
  httpServer = http.createServer (req, res) ->
    if req.method is 'GET'
      if req.url.indexOf("favicon") > -1
      	res.writeHead(200, {'Content-Type': 'image/x-icon', 'Connection': 'close'})
      	res.end("")
      else
        res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'close'})
        options =
          flags: "r"
          encoding: "binary"
			    mode: 0666
			    bufferSize: 4*1024

        localpath = path.join(__dirname, "client.html")
        fullpath = path.normalize(localpath)
        fs.createReadStream(fullpath, options).addListener("data", (chunk) ->
          res.write(chunk, "binary")
        ).addListener("end", () ->
          res.end()
        )
    else
      res.writeHead(404)
      res.end()


  server = ws.createServer({server: httpServer})

  server.addListener("listening", () ->
    sys.log("Listening for connections.")
  )

  server

exports.setup = setup

