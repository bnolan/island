class Vector
  constructor: (x,y,z) ->
    @x = x || 0
    @y = y || 0
    @z = z || 0

  add: (v) ->
    new Vector(@x + v.x, @y + v.y, @z + v.z)

  subtract: (v) ->
    new Vector(@x - v.x, @y - v.y, @z - v.z)

  toString: ->
    "#{@x},#{@y},#{@z}"
    
this.Vector = Vector