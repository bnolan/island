class Zombie extends Creature

  #
  # Period is the number of seconds this update is meant to last for.
  #
  tick: (period) ->
    @radius = new Vector 30, 30, 0
    
    # period = 0
    speed = 50 # cm/s
    attacks = 0.2 # a/s
    
    p = @getPosition()
    
    # console.log period
    
    # Attack counter
    a = @get('attack') || 0

    # Braaains counter
    b = @get('brains') || Math.random() * 2 + 2
      
    # @redraw()
    
    player = Players.findNearestTo(@getPosition()).first()
    
    if player.getPosition().x + player.radius.x + @radius.x < p.x
      p.x -= period * speed
    else if player.getPosition().x - player.radius.x - @radius.x > p.x
      p.x += period * speed

    if player.getPosition().y + player.radius.y + @radius.y < p.y
      p.y -= period * speed
    else if player.getPosition().y - player.radius.y - @radius.x > p.y
      p.y += period * speed

    # Can we attack the user?
    
    v = player.getPosition()

    # Are we in attack range?
    if v.subtract(p).length() < @radius.x + player.radius.x + 5
      
      a -= period
    
      if a <= 0
        a = 1 / attacks
        @notifyAction "OM NOM NOM"

      
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
    
    
  
this.Zombie = Zombie