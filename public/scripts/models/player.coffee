class Player extends Model
  constructor: ->
    super
    
    @div = $("<div />").addClass('player')
    
    @avatar = $("<img />").attr('src', '/system/uploads/34/original/boy.png?1288307760').addClass('avatar').appendTo @div
    @shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo @div
    
    @velocity = new Vector(0,0,0)
    @position = new Vector(@get('x'), @get('y'), @get('z'))
    @radius = new Vector(30, 10, 0)

    # Pause between subsequent jumps
    @jumpTimer = 10
    
    @draw()
    
    @dead = false
    @health = 10
    @maxHealth = 15
    
    @healthBar = $("#health")
    @animateHealth()

  notifyAction: (text) ->
    y = parseInt(@avatar.css('top')) + 60
    
    label = $("<label />").text(text).addClass('action')
    label.appendTo @div
    label.css({ top : y }).animate({ top : y - 15 }, 500, 'linear').animate { top : y - 30, opacity: 0}, 500, 'linear', =>
      label.remove()
    
  addHealth: (x, sender) ->
    @health = Math.min(@health + x, @maxHealth)
    @animateHealth()
  
  removeHealth: (x, sender) ->
    @health = Math.max(@health - x, 0)
    @animateHealth()
    
    if @health == 0
      @deathBy(sender)
      
  animateHealth: ->
    percentage = 100 / @maxHealth * @health
    @healthBar.find('span').stop().animate { width : "#{percentage}%" }, 1000
    @healthBar.find('label').text @health
    
  dropItem: (item) ->
    item.set {
      x : @position.x + @radius.x
      y : @position.y + 5
    }
    item.show()
    
  say: (message) ->
    $("<div />").addClass("speech").html("<label>#{message}</label>").appendTo @div
    
  deathBy: (sender) ->
    @dead = true

    @say "FUUUU!!"
    
    if sender instanceof Tile
      if sender.isWater()
        @div.addClass 'drowned'
        app.playerDied("from falling in the water. You must have forgotten your mom never taught you to swim.")

      if sender.isLava()
        @div.addClass 'drowned'
        app.playerDied("from trying to swim in the deadly molten lava.")
    
    if sender == "falling"
      @div.animate { opacity : 0, 'margin-top' : 500 }, 1000, 'linear'
      app.playerDied("from falling to the unknown regions far far below.")
    
  tick: ->
    if @dead
      return
      
    oldPosition = @position
    
    @position = @position.add(@velocity)

    # Test for out of bounds
    
    if @position.y <= 0 + @radius.y
      @position = oldPosition
      @velocity.y = 0

    if @position.x <= 0 + @radius.x
      @position = oldPosition
      @velocity.x = 0

    if @position.y >= 800 - @radius.y
      @position = oldPosition
      @velocity.y = 0
    
    # Test for need to scroll map
    
    margin = 100
    playfieldWidth = $('#playfield-container').width()
    
    if @position.x + parseInt($("#playfield").css('left')) > playfieldWidth - margin
      $("#playfield").stop().animate { left : - @position.x + margin * 2 }

    if @position.x + parseInt($("#playfield").css('left')) < margin
      $("#playfield").stop().animate { left : playfieldWidth - margin * 2 - @position.x }
      
    # Test for intersecting a tile

    tile = @getTile()
    stepHeight = 15 # Arbitrarily high to try and make sloped tiles work. Need to refactor
                    # around sloped tiles..
                    
    groundHeight = app.map.getHeightByRadius(@position, @radius)

    # The collision detection goes faulty on sloped tiles
    if (tile) && (tile.isRamp())
      groundHeight = app.map.getHeightByPoint(@position)
      
    if (groundHeight > @position.z + stepHeight)
      # Too large to step
      @position = oldPosition
      @velocity = new Vector
    else if (groundHeight >= @position.z)
      # Small step up, or ground collision
      @position.z = groundHeight
      @velocity.z = 0
    else
      # Falling
      @velocity.z -= 1

    # Check for death states
    
    if @position.z < 0
      @deathBy 'falling'
      
    if tile
      if tile.isDeadly() and @groundContact()
        @deathBy tile


    vacc = 1.5
    vdamp = 0.8
    vmax = 6
    @jumpTimer--
    
    if @groundContact()
      if $.keys[$.keyCodes.LEFT]
        @velocity.x -= vacc
      else if $.keys[$.keyCodes.RIGHT]
        @velocity.x += vacc
      else
        @velocity.x *= vdamp

      if $.keys[$.keyCodes.UP]
        @velocity.y -= vacc
      else if $.keys[$.keyCodes.DOWN]
        @velocity.y += vacc
      else
        @velocity.y *= vdamp 

      # Give a slight bump off the ground so we don't get stuck
      if $.keys[$.keyCodes.SPACE] and @jumpTimer <= 0
        @jumpTimer = 15
        @velocity.z = 10
        @position.z += 1
        @avatar.css({ height : 150, width : 100, 'padding-top' : 20}).animate({ height : 170, width: 100, 'padding-top' : 0 })
        
        # @avatar.css { '-webkit-transform' : 'rotate(90deg)' }

    @velocity.x = Math.clamp(@velocity.x, -vmax, vmax)
    @velocity.y = Math.clamp(@velocity.y, -vmax, vmax)
    @velocity.z = Math.clamp(@velocity.z, -20, 20)
    
  groundContact: ->
    @position.z <= app.map.getHeightByRadius(@position, @radius) + 5
    
  altitude: ->
    @position.z
    
  draw: ->
    if @div.parent().length==0
      @div.appendTo('#playfield').hide().fadeIn()

    height = 120
    altitude = @altitude()
    
    @div.css {
      top : @position.y
      left : @position.x
      'z-index' : parseInt(@position.y + altitude) + 10
    }
    
    @avatar.css { 
      top : 0 - altitude - height - 15
      left : -50
    }
    @shadow.css { 
      top :  0 - @groundHeight()  - 20
      left : -25
    }

  getTile: ->
    @getStack() && @getStack().getTop()
    
  getStack: ->
    x = Math.floor(@position.x / 100)
    y = Math.floor(@position.y / 80)
    
    app? && app.map.get(x,y)
    
  groundHeight: ->
    if @getStack()
      @getStack().height(@position.x, @position.y)
    else
      0
    
  getUpdateAttributes: ->
    {
      position : @position.toWire()
      velocity : @position.toWire()
      id : @id
    }
    


this.Player = Player