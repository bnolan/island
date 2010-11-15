class Particle
  constructor: (map) ->
    @map = map
    
    @position = app.player.getPosition().copy() # new Vector app.player.x, app.player.x, app.player.z
    @position.z = -100
    @velocity = new Vector 100, 0, -50   # m/s
    
    @div = $("<div />").addClass('particle').appendTo '#playfield'
    
    @draw()

    @bounciness = 0.8
    
    setInterval(@tick, 1 / 30)
    
  tick: (period) =>
    period = 1 / 30
    
    @position = @position.add(@velocity.multiply(period))
    @velocity.z += @map.gravity * period
    
    if @map.getHeightByPoint(@position) < @position.z
      @velocity.z *= -@bounciness
      
    @draw()
    
  draw: ->
    @div.css { left : @position.x, top : @position.y + @position.z }
    
this.Particle = Particle
