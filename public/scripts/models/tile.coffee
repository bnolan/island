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
    
  getName: ->
    @asset.get('name')
    
  getDescription: ->
    ""
    
  onclick: (e) =>
    position = @div.offset()

    ul = $(".menu").css({ left : e.clientX - 80, top : e.clientY - 90 }).hide().find('ul').empty()
    
    $(".menu .description").text @getDescription()
    $(".menu .name").text @getName()
    
    $("<li />").text("Destroy").appendTo(ul).click (e) =>
      $(".menu").fadeOut()
      e.preventDefault()
      @onDestroy(app.player)
    
    $(".menu").css({ left : e.clientX - 80, top : e.clientY - $(".menu").height() - 40 }).fadeIn()
    
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