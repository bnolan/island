Math.clamp = (v, min, max) ->
  Math.min(Math.max(min, v), max)

class Map
  constructor: ->
    @stacks = {}
    @gridWidth = 100
    @gridHeight = 80

  get: (x,y) ->
    index = "#{x},#{y}"

    if not @stacks[index]
      @stacks[index] = new Stack(this, x, y)

    @stacks[index]

  # Returns the highest ground point in the given radius [vector] of the position [vector].
  getHeightByRadius: (position, radius) ->

    pos1 = position.add(radius)
    pos2 = position.subtract(radius)
    
    height1 = @get(Math.floor(pos1.x / @gridWidth), Math.floor(pos1.y / @gridHeight)).height(pos1.x, pos1.y)
    height2 = @get(Math.floor(pos2.x / @gridWidth), Math.floor(pos2.y / @gridHeight)).height(pos2.x, pos2.y)

    Math.max(height1, height2)

  # Returns the height at a point
  getHeightByPoint: (position) ->
    @get(Math.floor(position.x / @gridWidth), Math.floor(position.y / @gridHeight)).height(position.x, position.y)
    
  save: ->
    $.ajax {
      url : '/map'
      type : 'POST'
      dataType : 'json'
      data : @toJSON()
    }

  empty: ->
    @stacks = {}
    
  refresh: (collection) ->
    @empty()
    
    for stack in collection
      @get(stack.x, stack.y).set(stack)

    for index, stack of @stacks
      stack.redrawShadows()
    
  toJSON: ->
    params = {}

    for index, stack of @stacks when not stack.isEmpty()
      params[index] = stack.toJSON()

    {
      stacks : params
    }

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
    @img = $("<img />").attr('src', @asset.getImageUrl()).appendTo @div
    
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
      stack.redrawShadows()
    
  redrawShadows: ->
    if @drawShadow()
      @div.find('.shadow').remove()

      if @stack.westernNeighbour() and (@stack.westernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo @div

      if @stack.easternNeighbour() and (@stack.easternNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo @div

      # if @stack.northernNeighbour() and (@stack.northernNeighbour().stackingHeight() < @stack.stackingHeight())
      #   $("<img />").addClass('shadow').attr('src', '/images/shadows/south.png').css({ top : -40 }).appendTo @div

      if @stack.northernNeighbour() and (@stack.northernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo @div

      # if @stack.northWesternNeighbour() and (@stack.northWesternNeighbour().stackingHeight() > @stack.stackingHeight())
      #   $("<img />").addClass('shadow').attr('src', '/images/shadows/northwest.png').appendTo @div
    
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
    
  toJSON: ->
    {
      asset_id : @asset.id
    }
    
class Stack
  constructor: (map, x,y) ->
    @map = map
    @tiles = []
    @x = x
    @y = y
    
  set: (params) ->
    @tiles = []
    
    for id in params.tiles.split(",")
      @newTile Assets.get(id)

    @redraw()
    
  redraw: ->
    # ....
    
  # x and y are in world coordinates
  height: (x,y) ->
    if @isEmpty()
      0
    else
      x = (x - @x * 100) / 100
      y = (y - @y * 100) / 100
    
      (@tiles.length - 1) * 40 + @getTop().getHeight(x, y)

  toJSON: ->
    {
      x : @x
      y : @y
      tiles : _(@tiles).invoke('toJSON')
    }
    
  redrawShadows: ->
    if @isEmpty()
      # ...
    else
      @getTop().redrawShadows()
      
  # Used for tiles stacking algorithm - height and stackingHeight need refactoring...
  stackingHeight: ->
    if @isEmpty()
      0
    else
      @tiles.length * 40
    
  push: (tile) ->
    @tiles.push tile
    tile.draw()

  newTile: (asset) ->
    tile = new Tile(this, asset)
    @push tile
    
  getTop: ->
    if @isEmpty()
      null
    else
      @tiles[@tiles.length - 1]
    
  pop: (tile) ->
    @tiles.pop()
    
  westernNeighbour: ->
    @getNeighbour @x - 1, @y

  easternNeighbour: ->
    @getNeighbour @x + 1, @y

  northernNeighbour: ->
    @getNeighbour @x, @y - 1

  northWesternNeighbour: ->
    @getNeighbour @x - 1, @y - 1

  southernNeighbour: ->
    @getNeighbour @x, @y + 1

  getNeighbour: (x,y) ->
    @map.get(x,y)

  getNeighbours: ->
    _.compact [
      @getNeighbour(@x - 1, y - 1),
      @getNeighbour(@x, y - 1),
      @getNeighbour(@x + 1, y - 1),
      @getNeighbour(@x + 1, y),
      @getNeighbour(@x + 1, y + 1),
      @getNeighbour(@x, y + 1),
      @getNeighbour(@x - 1, y + 1),
      @getNeighbour(@x - 1, y)
    ]
    
  isEmpty: ->
    @tiles.length == 0
    
class Application
  constructor: ->
    @gridWidth = 100
    @gridHeight = 80
    
    @canvasWidth = $(document).width()
    @canvasHeight = $(document).height()
    
    @el = $("<canvas />").attr('width', @canvasWidth).attr('height', @canvasHeight).appendTo '#playfield'
    
    @ctx = @el[0].getContext '2d'
    
    @draw()
    
    @map = new Map
    @map.refresh $MAP
    
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
    
    stack = @map.get(x,y)

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

    @ctx.strokeStyle = "#999";
    @ctx.closePath()
    @ctx.stroke()
      
  playerDied: (reason) ->
    alert "YOU HAVE DIED #{reason}"

    $("#playfield").fadeOut()
    
$(document).ready =>
  Assets.refresh $ASSETS
  @Assets = Assets
  
  @app = new Application

