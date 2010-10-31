class Player
  constructor: ->
    @div = $("<div />").addClass('player')
    
    @avatar = $("<img />").attr('src', '/system/uploads/34/original/boy.png?1288307760').addClass('avatar').appendTo @div
    @shadow = $("<img />").attr('src', '/system/uploads/35/original/shadow.png?1288308096').addClass('shadow').appendTo @div
    
    @velocity = new Vector(0,0,0)
    @position = new Vector(150,120,50)
    @radius = new Vector(10, 4, 0)
    
    @draw()
    
    @dead = false
    
  deathBy: (sender) ->
    @dead = true
    
    app.playerDied("FROM STANDING ON THE DEADLY #{sender.asset.get('name')}")
    
  tick: ->
    if @dead
      return
      
    oldPosition = @position
    
    @position = @position.add(@velocity)

    # Tile!
    
    tile = @getTile()
    
    if tile
      if tile.isDeadly() and @groundContact()
        @deathBy tile
    
    if @position.y <= 0 + @radius.y
      @position.y = 0 + @radius.y
      @velocity.y = 0

    if @position.x <= 0 + @radius.x
      @position.x = 0 + @radius.x
      @velocity.x = 0

    if @position.y >= 1000 - @radius.y
      @position.y = 1000 - @radius.y
      @velocity.y = 0
      
    if @groundContact()
      @velocity.z = 0
      @position.z = @groundHeight()
    else
      @velocity.z -= 1

    vacc = 1.5
    vdamp = 0.8
    vmax = 6

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
      if $.keys[$.keyCodes.SPACE]
        @velocity.z = 10
        @position.z += 1
        @avatar.css({ height : 120, width : 100, 'padding-top' : 50}).animate({ height : 170, width: 100, 'padding-top' : 0 })
        
        # @avatar.css { '-webkit-transform' : 'rotate(90deg)' }

    @velocity.x = Math.clamp(@velocity.x, -vmax, vmax)
    @velocity.y = Math.clamp(@velocity.y, -vmax, vmax)
    @velocity.z = Math.clamp(@velocity.z, -20, 20)
    
  groundContact: ->
    @position.z <= @groundHeight()
    
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
    


this.Player = Player