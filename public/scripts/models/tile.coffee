class Tile
  constructor: (stack, asset) ->
    @stack = stack
    @asset = asset
    
    @gridWidth = 100
    @gridHeight = 80

    @div = $("<div />").addClass 'tile'
    @img = $("<img />").attr('src', @asset.getImageUrl()).appendTo @div
    
    @div.click @onclick
    
  draw: ->
    x = @stack.x
    y = @stack.y
    
    height = @stack.stackingHeight()
    
    @div.css { 
      position : 'absolute'
      left : x * @gridWidth
      top : y * @gridHeight - @div.height() - 5 - height
      'z-index' : y * @gridHeight + height
    }
    
    $("<label>#{x},#{y},#{height}</label>").appendTo @div

    if @div.parent().length==0
      @div.appendTo '#playfield'

    # Shadow pass ;)

    @redrawShadows()
    
    for stack in @stack.getNeighbours()
      stack.redrawShadows()
    
  remove: ->
    @stack.pop()
    @div.remove()
    
  redrawShadows: ->
    @div.find('.shadow').remove()

    if @drawShadow()
      if (@stack.westernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo @div

      if (@stack.easternNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo @div

      # if @stack.northernNeighbour() and (@stack.northernNeighbour().stackingHeight() < @stack.stackingHeight())
      #   $("<img />").addClass('shadow').attr('src', '/images/shadows/south.png').css({ top : -40 }).appendTo @div

      if (@stack.northernNeighbour().stackingHeight() > @stack.stackingHeight())
        $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo @div

      # if @stack.northWesternNeighbour() and (@stack.northWesternNeighbour().stackingHeight() > @stack.stackingHeight())
      #   $("<img />").addClass('shadow').attr('src', '/images/shadows/northwest.png').appendTo @div
    
  # x and y are in local coordinate space between 0 and 1
  getHeight: (x,y) ->
    if @isRamp()
      (@asset.get('height_east') - @asset.get('height_west')) * x + @asset.get('height_west')
    else
      40
  
  # Should be overridden
  getName: ->
    @asset.get('name')
    
  # Should be overridden
  getDescription: ->
    ""
    
  # Should be overridden
  verbs: ->
    []
    
  onclick: (e) =>
    # position = @div.offset()

    console.log e.button
    
    player = app.player
    
    menu = new PopupMenu e
    
    menu.setName @getName()
    menu.setDescription @getDescription()
    
    for verb in @verbs()
      func = this[verb.getCallbackName()]

      if player.canPerform verb
        # Add the menu item to do it
        menu.addMenuItem verb.getName(), verb.getDescription(), =>
          func.call(this, player)
      else
        menu.addDisabledMenuItem verb.getName(), verb.getRequirements()
    
    menu.show()
    
    e.preventDefault()
    e.stopPropagation()

  onDestroy: ->
    # >..
    @remove()
    
  isRamp: ->
    @asset.get('name').match /ramp/i

  isDeadly: ->
    @isLava() or @isWater()
    
  isLava: ->
    @asset.get('name').match /lava/i
    
  isWater: ->
    @asset.get('name').match /water/i

  drawShadow: ->
    if @isRamp()
      return false

    true
    
  toJSON: ->
    {
      asset_id : @asset.id
    }

this.Tile = Tile