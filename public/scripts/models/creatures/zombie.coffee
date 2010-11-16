class Zombie extends Creature

  getName: ->
    "Level 1 Zombie"
    
  getDescription: ->
    "It looks hungry. I think it wants your brains."

  verbs: ->
    [ Verb.bash ]

  onVerbBash: (sender) =>
    @removeHealth 3.5, sender
    console.log 'ow!'
    
    # ....
    
  #
  # Period is the number of seconds this update is meant to last for.
  #
  tick: (period) ->
    @radius = new Vector 25, 25, 0
    @attackRadius = 80
    
    # period = 0
    speed = 100 # cm/s
    attacks = 0.2 # a/s
    
    old = @getPosition()
    p = @getPosition()

    gh = @map.getHeightByRadius(p, @radius) # @getGroundHeight(p)
    
    # console.log period
    
    # Attack counter
    a = @get('attack') || 0

    # Braaains counter
    b = @get('brains') || Math.random() * 2 + 2
      
    # @redraw()
    
    # Move zombie and do collision detection...
    
    player = Players.findNearestTo(@getPosition()).first()

    if player.getPosition().x + player.radius.x + @radius.x < p.x
      p.x -= period * speed
    else if player.getPosition().x - player.radius.x - @radius.x > p.x
      p.x += period * speed

    if gh != @map.getHeightByRadius(p, @radius)
      p = old

    if player.getPosition().y + player.radius.y + @radius.y < p.y
      p.y -= period * speed
    else if player.getPosition().y - player.radius.y - @radius.x > p.y
      p.y += period * speed

    if gh != @map.getHeightByRadius(p, @radius)
      p = old

    if @creatureCollision(p)
      p = old
      
    # Can we attack the user?
    
    v = player.getPosition()

    # Are we in attack range?
    if (v.subtract(p).length() < @attackRadius) and (v.z == p.z)
      
      a -= period
    
      if a <= 0
        a = 1 / attacks
        @notifyAction "OM NOM NOM"
        player.removeHealth 5

      
    else

      # Say braiins..
      b -= period
    
      if b <= 0
        b = Math.random() * 5 + 5
        @notifyAction "BRAAAINS"
      
      
    @setPosition p
      
    # @destination = player.getPosition()

    @set { 
      attack : a
      brains : b
    }
    

Zombie.spawn = (map) ->
  z = new Zombie { health : 10, maxHealth : 10, id : RandomGUID() }
  
  # stack = new Stack # map.get -1, -1
  
  # while stack.isEmpty()
  x = 10 # parseInt(Math.random() * 10) + 6# Math.random() * map.getWidth())
  y = parseInt(Math.random() * map.getHeight())
  
  stack = map.get x,y
    
  z.setPosition(new Vector((x + 0.5) * map.getGridWidth(), (y + 0.5) * map.getGridHeight(), 0))

  # z.save()
  z.show()

  Creatures.add z
  
  z
    
  
this.Zombie = Zombie