util = require('util')
redis = require('redis')
db = redis.createClient()

class Character
  constructor: (@name, @conn) ->
    @conn.addListener( 'message', (message) =>
      @conn.send("Logged in as: " + @name)
    )

exports.load = (name, conn) ->
  conn.send("Welcome back,  " + name)

exports.create = (name, password, conn) ->
  db.set('login_' + name, password)
  conn.send("Created character " + name + " with password " + password)
  conn.addListener("message", (message) ->
    conn.send("Unrecognized command: " + message)
  )
