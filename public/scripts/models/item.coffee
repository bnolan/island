class Item extends Model
  constructor: ->
    super
    
    @div = $("<div />").addClass('item')
    
    @asset = Assets.get(38)
    
    @icon = $("<img />").attr('src', @asset.get('upload_url')).addClass('icon').appendTo @div
    @shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo @div

    @div.click @onclick
    
    @redraw()

    @evalCode()
    
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
    @div.show()
    
    if @onShow
      @onShow()
    
  hide: ->
    @div.hide()
    
    if @onHide
      @onHide()
      
  getPosition: ->
    new Vector(@get('x'), @get('y'), 0)
    
  onclick: (e) =>
    position = @div.offset()
    
    $(".menu").css({ left : position.left - 275, top : position.top - 300 }).hide().fadeIn()
    
    e.preventDefault()
  
  remove: ->
    if @onRemove
      @onRemove()
    else
      @div.remove()
      
  redraw: ->
    if @div.parent().length==0
      @div.appendTo('#playfield').hide().fadeIn()

    position = @getPosition()

    height = 120
    altitude = app.map.getHeightByPoint(position)
    
    @div.css {
      top : position.y
      left : position.x
      'z-index' : parseInt(position.y + altitude) + 10
    }
    
    @icon.css { 
      top : 0 - altitude - height - 15
      left : -50
    }
    
    @shadow.css { 
      top :  0 - altitude  - 20
      left : -25
    }
    

Items = new Backbone.Collection
Items.model = Item

this.Items = Items
this.Item = Item