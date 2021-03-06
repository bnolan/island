class Vector
  constructor: (x,y,z) ->
    @x = x || 0
    @y = y || 0
    @z = z || 0

  copy: ->
    new Vector @x, @y, @z
    
  inverse: ->
    new Vector -@x, -@y, -@z
    
  add: (v) ->
    new Vector(@x + v.x, @y + v.y, @z + v.z)

  multiply: (i) ->
    new Vector @x * i, @y * i, @z * i
    
  distanceTo: (v) ->
    @subtract(v).length()
    
  subtract: (v) ->
    new Vector(@x - v.x, @y - v.y, @z - v.z)

  toString: ->
    "#{@x},#{@y},#{@z}"
  
  toWire: ->
    for component in [@x, @y, @z]
      Math.floor component

  length: ->
    Math.sqrt( @x * @x + @y * @y + @z * @z )

this.Vector = Vector