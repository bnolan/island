class Map
  constructor: ->
    @stacks = {}
    @gridWidth = 100
    @gridHeight = 80
    @maxY = 8
    @maxX = 100

  autogenerate: ->
    x = 1
    y = 3
    w = 2
    h = 2
    
    grass = Assets.find (asset) ->
      asset.get('name').match /grass/i

    dirt = Assets.find (asset) ->
      asset.get('name').match /dirt/i
    
    for xx from x to x + w
      for yy from y to y + h
        stack = @get(xx,yy)
        
        if not stack.isFull()
          stack.newTile Assets.first()

    for j from 1 to 100
      x = Math.floor(Math.random() * @maxX)
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
                grass
            )
    
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


this.Map = Map