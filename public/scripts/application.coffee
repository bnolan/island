Math.clamp = (v, min, max) ->
  Math.min(Math.max(min, v), max)

String.prototype.capitalize = ->
  this.charAt(0).toUpperCase() + this.slice(1);

class Model
  constructor: ->
    Backbone.Model.apply(this, arguments)
    
_.extend(Model::, Backbone.Model.prototype)

this.Model = Model
    
class Playfield
  constructor: (parent) ->
    @container = $(parent).addClass('game-container')
    
    @el = $("<div id='playfield' />").appendTo @container
    
    window.app = new Application
    this.app = window.app

  setCenter: (x,y) ->
    @el.css { 
      left : 0 + @container.width() / 2 - x
      top: 0 + @container.height() / 2 - y
    }
    
this.Playfield = Playfield

class WebSocketService
  constructor: (app, socket) ->
    @socket = socket
    @app = app
    
    @hasConnection = false

  welcomeHandler: (data) ->
    # ...
    
  connectionClosed: ->
    @hasConnection = false
    console.log 'Connection closed'
    
  updateHandler: (data) ->
    player = @app.players[2]
    
    player.position.x = data.position[0]
    player.position.y = data.position[1]
    player.position.z = data.position[2]
    
    player.draw(200)
    
    
  processMessage: (data) ->
    func = this[data.type + 'Handler']
    
    if func
      func.call(this, data)
    else
      console.log "No handler for message type #{data.type}"
  
  sendUpdate: (model) ->
    obj = model.getUpdateAttributes()

    obj.type = 'update'

    @socket.send(JSON.stringify(obj))

class Application
  constructor: ->
    @gridWidth = 100
    @gridHeight = 80

    if $ASSETS?
      Assets.refresh $ASSETS
    
    if $ITEMS?
      Items.refresh $ITEMS

    @canvasWidth = $(document).width()
    @canvasHeight = $(document).height()
    
    @el = $("<canvas />").attr('width', @canvasWidth).attr('height', @canvasHeight).appendTo '#playfield'
    
    @ctx = @el[0].getContext '2d'
    
    @players = {}
    
    @draw()
    
    @map = new Map

    @webSocket = new WebSocket("ws://localhost:8180")
    @webSocket.onopen = @onSocketOpen
    @webSocket.onclose = @onSocketClose
    @webSocket.onmessage = @onSocketMessage

    @webSocketService = new WebSocketService(this, @webSocket);

    
    # if $MAP?
    #   @map.refresh $MAP

    @map.autogenerate()
    
    # $("#playfield").draggable {
    #   axis : 'x'
    # }
    $("#playfield").click @onclick

    $("#playfield").css { top : ($('#playfield-container').height() - @map.getDimensions().y) / 2 }
    
    $(".toolbox .asset").click (e) ->
      $(".toolbox .asset").removeClass('selected')
      $(e.currentTarget).addClass 'selected'
      e.preventDefault()

  log: (message) ->
    console.log message
    
  onSocketOpen: (e) =>
    # uri = parseUri(document.location)
    # if ( uri.queryKey.oauth_token ) {
    #   app.authorize(uri.queryKey.oauth_token, uri.queryKey.oauth_verifier)            
    # }
    
  onSocketClose: =>
    @webSocketService.connectionClosed()
    
  onSocketMessage: (e) =>
    data = null
    
    try
      data = JSON.parse(e.data)
    catch err
      console.log "Unable to parse message"
      console.log e.data
      return

    @webSocketService.processMessage(data);
    
  addPlayer: ->
    for i from 1 to 3
      Zombie.spawn(@map)
    
    # @creature = new Zombie { x : 350, y : 360}
    # @creature.show()
    
    @player = new Player($PLAYER)
    setInterval @tick, 33
    setInterval @networkTick, 200
    setInterval @creatureTick, 100

    for player in $PLAYERS
      if player.id != @player.id
        p = new Player(player)
        p.hide()
        @players[player.id] = p

    $.keys = {}
    $.keyCodes = {ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}
    
    $(document).keydown (e) =>
      $.keys[e.keyCode] = true

    $(document).keyup (e) =>
      $.keys[e.keyCode] = false
    
  tick: =>
    @player.draw()
    @player.tick()
    
  creatureTick: ->
    for creature in Creatures.models
      creature.redraw()
      creature.tick( 1 / 10 )

  networkTick: =>
    if not @player.dead
      @webSocketService.sendUpdate @player
    
  onclick: (e) =>
    $(".menu:visible").fadeOut()

    if $(".asset.selected").length > 0
      x = e.clientX - @el.offset().left
      y = e.clientY - @el.offset().top
    
      x = Math.floor x / @gridWidth
      y = Math.floor y / @gridHeight
    
      @addTile x, y
    
  addTile: (x,y) ->
    index = "#{x},#{y}"
    
    stack = @map.get(x,y)

    asset = Assets.get $(".asset.selected").attr('data-id')
    
    stack.newTile(asset)
    
  draw: ->
    w = @canvasWidth
    h = @canvasHeight
    
    @ctx.beginPath()

    for y from 0 to h / @gridHeight
      @ctx.moveTo 0, y * @gridHeight
      @ctx.lineTo w, y * @gridHeight

    for x from 0 to w / @gridWidth
      @ctx.moveTo x * @gridWidth, 0
      @ctx.lineTo x * @gridWidth, h

    @ctx.strokeStyle = "#999";
    @ctx.closePath()
    @ctx.stroke()
      
  playerDied: (reason) ->
    # alert "YOU HAVE DIED #{reason}"
    # $("#playfield").fadeOut()

this.Application = Application