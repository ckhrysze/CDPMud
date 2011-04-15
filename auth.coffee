util = require('util')
redis = require('redis')
db = redis.createClient()
character = require('./character')

class Auth
  constructor: (@conn) ->
    @attempts = 0
    @name = ""

  login: () ->
    @conn.send('Please enter your character name:')
    @conn.once('message', (msg) => @nameListener(msg))

  nameListener: (message) ->
    if message.length < 4
      @conn.send('Character names must be at least 4 characters');
      @login()
    else
      @name = message
      @pendingPassword()

  pendingPassword: () ->
    @conn.send('Please enter your password:')
    @conn.once('message', (msg) => @passListener(msg))
    
  passListener: (message) ->
    db.get('login_' + @name, (error, password) =>
      if password? # validate password
        if password is message
          character.load(@name, @conn)
        else # bad password
          @attempts += 1
          if @attempts > 3
            @conn.send('Too many attempts, bye bye now.')
            @conn.close()
            return 0
          else
            @conn.send('Invalid password, please try again:')
            @pendingPassword()
      else # password not set, new character
        character.create(@name, message, @conn)
    )

module.exports = Auth