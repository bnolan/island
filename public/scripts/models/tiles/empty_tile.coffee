class EmptyTile extends Tile
  constructor: (stack) ->
    super(stack)
      
  verbs: ->
    [  ]
    
  getName: ->
    "Empty block"
    
  getDescription: ->
    "Just an empty bit of ground."
    
this.EmptyTile = EmptyTile