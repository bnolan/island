class Vector
  constructor: (x,y,z) ->
    @x = x || 0
    @y = y || 0
    @z = z || 0

  copy: ->
    new Vector @x, @y, @z
    
  add: (v) ->
    new Vector(@x + v.x, @y + v.y, @z + v.z)

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