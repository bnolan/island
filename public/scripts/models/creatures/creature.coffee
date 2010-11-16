class Creature extends Model
  constructor: () ->
    @map = app.map
    
    super

  getHealth: ->
    @get('health')
    
  addHealth: (x, sender) ->
    h = @get('health')
    h = Math.min(@health + x, @maxHealth)
    
    @set { health : h }
    
    @animateHealth()

  removeHealth: (x, sender) ->
    h = @get('health')
    h = Math.max(h - x, 0)

    if h == 0
      @deathBy(sender)
      
    @set { health : h }

    @animateHealth()

  animateHealth: ->
    h = @get('health')

    percentage = 100 / @get('maxHealth') * h
    @healthBar.find('span').stop().animate { width : "#{percentage}%" }, 1000

    # @healthBar.find('label').text @health
    
  deathBy: (sender) ->
    Sounds.play('explosion')
    app.log "You killed a #{@getName()}"
    @hide()
    Creatures.remove @id

  collidesWith: (position) ->
    @getPosition().distanceTo(position) < 100 # radius.length() + @radius.length()

  nearbyCreatures: ->
    id = @cid
    
    _ Creatures.select (creature) =>
      creature.cid != id

  creatureCollision: (position) ->
    @nearbyCreatures().find (creature) =>
      (creature.getPosition().distanceTo(position) < @radius.length())
  
  # ellipseGroundIntersection: (position, radius) ->
  #   false
    
    
  getGroundHeight: (position) ->
    if not position
      position = new Vector @get('x'), @get('y'), 0
    
    @getStack(position).height(position.x, position.y)

  getStack: (position) ->
    if not position
      position = @getPosition()

    x = Math.floor(position.x / 100)
    y = Math.floor(position.y / 80)

    app? && app.map.get(x,y)

  verbs: ->
    []

  onMouseOver: ->
    @healthBar.show()

  onMouseOut: ->
    @healthBar.hide()

  onclick: (e) =>
    # position = @div.offset()

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

  createElements: ->
    @div = $("<div />").addClass('creature').hide()
    @div.appendTo '#playfield'

    @shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo @div
    @icon = $("<img />").attr('src', '/images/creatures/zombie.png').addClass('icon').appendTo @div
    @healthBar = $("<div />").addClass('healthbar').html("<span />").appendTo @div
    @animateHealth()
    
    @healthBar.hide()
    
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
    new Vector(@get('x'), @get('y'), @getGroundHeight())
    
  setPosition: (p) ->
    @set {
      x : p.x
      y : p.y
      z : p.z
    }
    
  
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
      top : position.y - 10
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
    

Creatures = new Backbone.Collection
Creatures.model = Creature
this.Creatures = Creatures

# Items.findByName = (name) ->
#   Items.find (item) ->
#     item.get('name') == name
#
# this.Items = Items

this.Creature = Creature
