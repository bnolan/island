class Creature extends Model
  constructor: () ->
    # @map = map
    
    super

  createElements: ->
    @div = $("<div />").addClass('creature').hide()
    @div.appendTo '#playfield'

    @shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo @div
    @icon = $("<img />").attr('src', '/images/creatures/zombie.png').addClass('icon').appendTo @div

    @icon.click @onclick
    
    @redraw()
    
    @show()
    
  # evalCode: ->
  #   behaviours = null
  #   
  #   try
  #     eval("behaviours = " + @get("code"));
  #   catch e
  #     console.log e
  #   
  #   if behaviours
  #     for name, func of behaviours
  #       this[name] = func
  # 

  notifyAction: (text) ->
    y = parseInt(@icon.css('top')) + 10
    
    label = $("<label />").text(text).addClass('action')
    label.appendTo @div
    label.css({ top : y }).animate({ top : y - 15 }, 1000, 'linear').animate { top : y - 30, opacity: 0}, 1000, 'linear', =>
      label.remove()

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
    
  setPosition: (p) ->
    @set {
      x : p.x
      y : p.y
      z : p.z
    }
    
  # todo: refactor into menu class
  onclick: (e) =>
    # position = @div.offset()
    # 
    # ul = $(".menu").hide().find('ul').empty()
    # 
    # $(".menu .description").text @get('description')
    # $(".menu .name").text @get('name')
    # 
    # if @getVerbs
    #   for verb in @getVerbs()
    #     func = this["onVerb#{verb.capitalize()}"]
    # 
    #     $("<li />").text(verb.capitalize()).appendTo(ul).click (e) =>
    #       $(".menu").fadeOut()
    #       e.preventDefault()
    # 
    #       func.call(this, app.player)
    # 
    # $(".menu").css({ left : e.clientX - 80, top : e.clientY - $(".menu").height() - 40 }).fadeIn()
    # 
    # e.preventDefault()
    # e.stopPropagation()
  
  # Removes the item from the world
  remove: ->
    @div.hide().remove()
    @div = null
      
  redraw: ->
    if not @div
      @createElements()

    position = @getPosition()

    width = 70 # @get('width')
    height = 70 # @get('height')
    altitude = app.map.getHeightByPoint(position)
    
    @div.css {
      top : position.y
      left : position.x
      'z-index' : parseInt(position.y + altitude) + 10
    }
    
    anchor = 22 # @asset.get('anchor_y') || 0
    
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
    

# Creatures = new Backbone.Collection
# Items.model = Item
# Items.findByName = (name) ->
#   Items.find (item) ->
#     item.get('name') == name
#
# this.Items = Items
this.Creature = Creature
