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
    
    @draw()
    
    @map = new Map
    
    if $MAP?
      @map.refresh $MAP

    @map.autogenerate()
    
    # $("#playfield").draggable {
    #   axis : 'x'
    # }
    $("#playfield").click @onclick
    
    $(".toolbox .asset").click (e) ->
      $(".toolbox .asset").removeClass('selected')
      $(e.currentTarget).addClass 'selected'
      e.preventDefault()

  addPlayer: ->
    @player = new Player
    setInterval @tick, 33

    $.keys = {}
    $.keyCodes = {ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}
    
    $(document).keydown (e) =>
      $.keys[e.keyCode] = true

    $(document).keyup (e) =>
      $.keys[e.keyCode] = false
    
  tick: =>
    @player.draw()
    @player.tick()
    
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