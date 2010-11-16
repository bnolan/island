class Particle
  constructor: (map) ->
    @map = map
    
    @position = app.player.getPosition().copy() # new Vector app.player.x, app.player.x, app.player.z
    @position.z += 30
    @velocity = new Vector 200, 0, 0   # m/s
    
    @div = $("<div />").addClass('particle').appendTo '#playfield'
    
    @draw()

    @bounciness = 0.8
    @weight = 0
    
    @interval = setInterval(@tick, 1 / 30)
    
  tick: (period) =>
    period = 1 / 30
    
    @position = @position.add(@velocity.multiply(period))
    @velocity.z += @map.gravity * period * @weight
    
    if @map.getHeightByPoint(@position) > @position.z
      @destroy()
      
    @draw()
    
    @checkCollisions()
    
  checkCollisions: ->
    for creature in Creatures.models
      if (creature.getPosition().distanceTo(@position) < creature.radius.length() + 30)
        @onCollide creature
    
  onCollide: (sender) ->
    if sender instanceof Creature
      sender.deathBy app.player
    else
      throw "Unimplemented"
    
  destroy: ->
    clearInterval @interval
    @div.remove()
    
  draw: ->
    @div.css { left : @position.x, top : @position.y - @position.z }
    
this.Particle = Particle
