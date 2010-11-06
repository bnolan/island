class GrassTile extends Tile
  constructor: (stack) ->
    asset = Assets.find (asset) ->
      asset.get('name').match /grass/i

    super(stack, asset)
      
  tick: (seconds) ->
    rate = 0.1  #  kgmin-1
    maxBiomass = 50
    mass = Math.clamp @get('biomass') + rate * seconds, 0, 50
    @set { biomass : mass }

  verbs: ->
    [ Verb.mow, Verb.dig ]
    
  onVerbDig: (player) ->
    item = Items.findByName "Compost"
    
    player.doAction "Digging", "5", =>
      @remove()
      
      player.pickup(item)
      
  getName: ->
    "Grass"
    
  getDescription: ->
    "Lush green grass with dew glistening and the fresh smell of summer."
    
this.GrassTile = GrassTile