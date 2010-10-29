Math.clamp = (v, min, max) ->
  Math.min(Math.max(min, v), max)

class Model
  constructor: ->
    Backbone.Model.apply(this, arguments)
    
_.extend(Model::, Backbone.Model.prototype)

class Asset extends Model

    getImageUrl: ->
      @get('upload_url')
    
Assets = new Backbone.Collection
Assets.model = Asset


class Tile
  constructor: (stack, asset) ->
    @stack = stack
    @asset = asset
    
    @gridWidth = 100
    @gridHeight = 80

    @div = $("<div />").addClass 'tile'
    $("<img />").attr('src', @asset.getImageUrl()).appendTo @div
    
  draw: ->
    x = @stack.x
    y = @stack.y
    
    height = @stack.stackingHeight()
    
    @div.css { 
      position : 'absolute'
      left : x * @gridWidth
      top : y * @gridHeight - @div.height() - 50 - height
      'z-index' : y * @gridHeight + height
    }
    
    $("<label>#{x},#{y},#{height}</label>").appendTo @div

    if @div.parent().length==0
      @div.appendTo '#playfield'

    # Shadow pass ;)

    @redrawShadows()
    
    for stack in @stack.getNeighbours()
      stack.getTop().redrawShadows()
    
  redrawShadows: ->
    if @drawShadow()
      @div.find('.shadow').remove()

      if @stack.westernNeighbour() and (@stack.westernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo @div

      if @stack.easternNeighbour() and (@stack.easternNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo @div

      if @stack.northernNeighbour() and (@stack.northernNeighbour().stackingHeight() < @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/south.png?4').css({ top : -40 }).appendTo @div

      if @stack.northernNeighbour() and (@stack.northernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo @div
    
  # x and y are in local coordinate space between 0 and 1
  getHeight: (x,y) ->
    if @isRamp()
      (@asset.get('height_east') - @asset.get('height_west')) * x + @asset.get('height_west')
    else
      40
    
  isRamp: ->
    @asset.get('name').match /ramp/i

  isDeadly: ->
    @isLava() or @isWater()
    
  isLava: ->
    @asset.get('name').match /lava/i
    
  isWater: ->
    @asset.get('name').match /water/i

  drawShadow: ->
    if @isRamp()
      return false

    true
    
class Stack
  constructor: (map, x,y) ->
    @map = map
    @tiles = []
    @x = x
    @y = y
    
  # x and y are in world coordinates
  height: (x,y) ->
    x = (x - @x * 100) / 100
    y = (y - @y * 100) / 100
    
    (@tiles.length - 1) * 40 + @getTop().getHeight(x, y)

  # Used for tiles stacking algorithm - height and stackingHeight need refactoring...
  stackingHeight: ->
    @tiles.length * 40
    
  push: (tile) ->
    @tiles.push tile
    tile.draw()

  newTile: (asset) ->
    tile = new Tile(this, asset)
    @push tile
    
  getTop: ->
    @tiles[@tiles.length - 1]
    
  pop: (tile) ->
    @tiles.pop()
    
  westernNeighbour: ->
    @getNeighbour @x - 1, @y

  easternNeighbour: ->
    @getNeighbour @x + 1, @y

  northernNeighbour: ->
    @getNeighbour @x, @y - 1

  southernNeighbour: ->
    @getNeighbour @x, @y + 1

  getNeighbour: (x,y) ->
    @map["#{x},#{y}"]

  getNeighbours: ->
    _.compact [
      @getNeighbour(@x - 1, y),
      @getNeighbour(@x, y - 1),
      @getNeighbour(@x, y + 1),
      @getNeighbour(@x + 1, y)
    ]
    
  save: ->
    for tile in @tiles
      tile.save()
    # ...
  
class Vector
  constructor: (x,y,z) ->
    @x = x || 0
    @y = y || 0
    @z = z || 0
    
  add: (v) ->
    new Vector(@x + v.x, @y + v.y, @z + v.z)
    
class Player
  constructor: ->
    @div = $("<div />").addClass('player')
    
    @avatar = $("<img />").attr('src', '/system/uploads/34/original/boy.png?1288307760').addClass('avatar').appendTo @div
    @shadow = $("<img />").attr('src', '/system/uploads/35/original/shadow.png?1288308096').addClass('shadow').appendTo @div
    
    @velocity = new Vector(0,0,0)
    @position = new Vector(150,120,50)
    @radius = new Vector(10, 4, 0)
    
    @draw()
    
    @dead = false
    
  deathBy: (sender) ->
    @dead = true
    
    app.playerDied("FROM STANDING ON THE DEADLY #{sender.asset.get('name')}")
    
  tick: ->
    if @dead
      return
      
    oldPosition = @position
    
    @position = @position.add(@velocity)

    # Tile!
    
    tile = @getTile()
    
    if tile
      if tile.isDeadly() and @groundContact()
        @deathBy tile
    
    if @position.y <= 0 + @radius.y
      @position.y = 0 + @radius.y
      @velocity.y = 0

    if @position.x <= 0 + @radius.x
      @position.x = 0 + @radius.x
      @velocity.x = 0

    if @position.y >= 1000 - @radius.y
      @position.y = 1000 - @radius.y
      @velocity.y = 0
      
    if @groundContact()
      @velocity.z = 0
      @position.z = @groundHeight()
    else
      @velocity.z -= 1

    vacc = 1.5
    vdamp = 0.8
    vmax = 6

    if @groundContact()
      if $.keys[$.keyCodes.LEFT]
        @velocity.x -= vacc
      else if $.keys[$.keyCodes.RIGHT]
        @velocity.x += vacc
      else
        @velocity.x *= vdamp

      if $.keys[$.keyCodes.UP]
        @velocity.y -= vacc
      else if $.keys[$.keyCodes.DOWN]
        @velocity.y += vacc
      else
        @velocity.y *= vdamp 

      # Give a slight bump off the ground so we don't get stuck
      if $.keys[$.keyCodes.SPACE]
        @velocity.z = 10
        @position.z += 1

    @velocity.x = Math.clamp(@velocity.x, -vmax, vmax)
    @velocity.y = Math.clamp(@velocity.y, -vmax, vmax)
    @velocity.z = Math.clamp(@velocity.z, -20, 20)
    
  groundContact: ->
    @position.z <= @groundHeight()
    
  altitude: ->
    @position.z
    
  draw: ->
    if @div.parent().length==0
      @div.appendTo('#playfield').hide().fadeIn()

    height = 120
    altitude = @altitude()
    
    @div.css {
      top : @position.y
      left : @position.x
      'z-index' : parseInt(@position.y + altitude) + 10
    }
    
    @avatar.css { 
      top : 0 - altitude - height - 15
      left : -50
    }
    @shadow.css { 
      top :  0 - @groundHeight()  - 20
      left : -25
    }

  getTile: ->
    @getStack() && @getStack().getTop()
    
  getStack: ->
    x = Math.floor(@position.x / 100)
    y = Math.floor(@position.y / 80)
    
    index = "#{x},#{y}"

    app? && app.map[index]
    
  groundHeight: ->
    if @getStack()
      @getStack().height(@position.x, @position.y)
    else
      0
    
class Application
  constructor: ->

    @map = {}
    
    @gridWidth = 100
    @gridHeight = 80
    
    @canvasWidth = $(document).width()
    @canvasHeight = $(document).height()
    
    @el = $("<canvas />").attr('width', @canvasWidth).attr('height', @canvasHeight).appendTo '#playfield'
    
    @ctx = @el[0].getContext '2d'
    
    @draw()
    
    @player = new Player
    
    setInterval @tick, 33

    $.keys = {}
    $.keyCodes = {ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}
    
    $(document).keydown (e) =>
      $.keys[e.keyCode] = true

    $(document).keyup (e) =>
      $.keys[e.keyCode] = false

    $("#playfield").click @onclick
    
    $("img").click (e) ->
      $("img").removeClass('selected')
      $(e.currentTarget).addClass 'selected'
      e.preventDefault()
    
  tick: =>
    @player.draw()
    @player.tick()
    
  onclick: (e) =>
    x = e.clientX - @el.offset().left
    y = e.clientY - @el.offset().top
    
    x = Math.floor x / @gridWidth
    y = Math.floor y / @gridHeight
    
    @addTile x, y
    
  addTile: (x,y) ->
    index = "#{x},#{y}"
    
    stack = if @map[index]
      @map[index]
    else
      @map[index] = new Stack(@map, x, y)

    asset = Assets.get $("img.selected").attr('data-id')
    
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

    @ctx.closePath()
    @ctx.stroke()
      
  playerDied: (reason) ->
    alert "YOU HAVE DIED #{reason}"

    $("#playfield").fadeOut()
    
$(document).ready =>
  Assets.refresh $ASSETS
  @Assets = Assets
  
  @app = new Application

