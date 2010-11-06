class Item extends Model
  constructor: ->
    super
    @evalCode()

  createElements: ->
    @div = $("<div />").addClass('item').hide()
    @div.appendTo '#playfield'

    @asset = Assets.get(@get('asset_id'))

    @shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo @div
    @icon = $("<img />").attr('src', @asset.get('upload_url')).addClass('icon').appendTo @div

    @icon.click @onclick
    
    @redraw()
    
    @show()
    
  evalCode: ->
    behaviours = null
    
    try
      eval("behaviours = " + @get("code"));
    catch e
      console.log e
    
    if behaviours
      for name, func of behaviours
        this[name] = func

  show: ->
    @redraw()
    
    @div.show()
    
    if @onShow
      @onShow()
    
  hide: ->
    @div.hide()
    
    if @onHide
      @onHide()
      
  getPosition: ->
    new Vector(@get('x'), @get('y'), 0)
    
  # todo: refactor into menu class
  onclick: (e) =>
    position = @div.offset()
    
    ul = $(".menu").hide().find('ul').empty()
    
    $(".menu .description").text @get('description')
    $(".menu .name").text @get('name')
    
    if @getVerbs
      for verb in @getVerbs()
        func = this["onVerb#{verb.capitalize()}"]

        $("<li />").text(verb.capitalize()).appendTo(ul).click (e) =>
          $(".menu").fadeOut()
          e.preventDefault()

          func.call(this, app.player)
    
    $(".menu").css({ left : e.clientX - 80, top : e.clientY - $(".menu").height() - 40 }).fadeIn()
    
    e.preventDefault()
    e.stopPropagation()
  
  # Removes the item from the world
  remove: ->
    @div.hide().remove()
    @div = null
      
  redraw: ->
    if not @div
      @createElements()

    position = @getPosition()

    height = @get('height')
    altitude = app.map.getHeightByPoint(position)
    
    @div.css {
      top : position.y
      left : position.x
      'z-index' : parseInt(position.y + altitude) + 10
    }
    
    width = @get('width')
    height = @get('height')
    
    anchor = @asset.get('anchor_y') || 0
    
    @icon.css { 
      width : width
      height : height
      top : 0 - altitude - height + anchor
      left : -width / 2
    }
    
    @shadow.css { 
      top :  0 - altitude - 10
      width : width
      left : -width / 2
    }
    

Items = new Backbone.Collection
Items.model = Item
Items.findByName = (name) ->
  Items.find (item) ->
    item.get('name') == name

this.Items = Items
this.Item = Item