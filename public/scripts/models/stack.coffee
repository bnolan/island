GroundHeight = -1000 # 1km up

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
      GroundHeight
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
      GroundHeight
    else
      @tiles.length * 40
    
  pop: ->
    @tiles.pop()

    for stack in getNeighbours()
      stack.redrawShadows()
    
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

this.Stack = Stack