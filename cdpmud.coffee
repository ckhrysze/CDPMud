util = require("util")
server = require("./server")

mud = server.setup()

Auth = require("./auth")

# Handle WebSocket Requests
mud.addListener "connection", (conn) ->
        conn.send "Welcome to CDP Mud"
        new Auth(conn).login()

mud.addListener "close", (conn) ->
        mud.broadcast "<"+conn.id+"> disconnected"

mud.listen 8000