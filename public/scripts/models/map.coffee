class Map
  constructor: ->
    @stacks = {}
    @gridDimensions = new Vector 100, 80, 0
    @gridWidth = @gridDimensions.x
    @gridHeight = @gridDimensions.y
    @maxY = 4
    @maxX = 50

  getExtents: ->
    new Vector @maxX, @maxY
    
  getWidth: ->
    @maxX
    
  getHeight: ->
    @maxY

  getGridWidth: ->
    @gridWidth

  getGridHeight: ->
    @gridHeight

  getDimensions: ->
    new Vector(@maxX * @gridWidth, @maxY * @gridHeight)
    
  autogenerate: ->
    x = 4
    y = 0
    w = 0
    h = @maxY - 1
    
    # stone = Assets.find (asset) ->
    #   asset.get('name').match /stone/i

    grass = Assets.find (asset) ->
      asset.get('name').match /grass/i

    dirt = Assets.find (asset) ->
      asset.get('name').match /dirt/i
    
    for xx from x to x + w
      for yy from y to y + h
        stack = @get(xx,yy)
        
        if not stack.isFull()
          stack.newTile grass

    for j from 1 to 20
      x = Math.floor(Math.random() * @maxX) + 4
      y = Math.floor(Math.random() * @maxY - 1) + 1
      
      w = Math.floor(Math.random() * 4)
      h = Math.floor(Math.random() * Math.min(3, @maxY - y))
      
      for xx from x to x + w
        for yy from y to y + h
          stack = @get(xx,yy)
          
          if not stack.isFull()
            stack.newTile(
              if Math.random() < 0.5 
                dirt
              else
                GrassTile
            )
            
    # @addItems()
    
  addItems: ->
    tree = Items.find (item) ->
      item.get('name').match /tree/i

    rock = Items.find (item) ->
      item.get('name').match /rock/i

    for j from 1 to 50
      # stack = @get(-1, -1)

      # Find a non-empty tile
      # while stack.isEmpty()

      x = Math.floor(Math.random() * @maxX)
      y = Math.floor(Math.random() * @maxY - 1) + 1
      stack = @get(x, y)

      position = stack.getCenter()
      
      item = if Math.random() < 0.5
        rock.clone()
      else
        tree.clone()
        
      item.set({
        x : position.x
        y : position.y
      })
      item.show()
    
  get: (x,y) ->
    
    if (y < 0) or (y >= @maxY)
      return null
      
    index = "#{x},#{y}"

    if not @stacks[index]
      @stacks[index] = new Stack(this, x, y)

    @stacks[index]

  # Does the ellipse defined by position, radius intersect with the map?
  ellipseIntersection: (position, radius) ->
    pos1 = position.add(radius)
    pos2 = position.subtract(radius)
    
    height1 = @get(Math.floor(pos1.x / @gridWidth), Math.floor(pos1.y / @gridHeight)).height(pos1.x, pos1.y)
    height2 = @get(Math.floor(pos2.x / @gridWidth), Math.floor(pos2.y / @gridHeight)).height(pos2.x, pos2.y)

    height1 != height2
    
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


this.Map = Map