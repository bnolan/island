(function() {
  var Creature, Creatures;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Creature = (function() {
    function Creature() {
      var _this;
      _this = this;
      this.onclick = function() { return Creature.prototype.onclick.apply(_this, arguments); };
      this.map = app.map;
      Creature.__super__.constructor.apply(this, arguments);
      return this;
    }
    return Creature;
  })();
  __extends(Creature, Model);
  Creature.prototype.getHealth = function() {
    return this.get('health');
  };
  Creature.prototype.addHealth = function(x, sender) {
    h = this.get('health');
    h = Math.min(this.health + x, this.maxHealth);
    this.set({
      health: h
    });
    return this.animateHealth();
  };
  Creature.prototype.removeHealth = function(x, sender) {
    h = this.get('health');
    h = Math.max(h - x, 0);
    if (h === 0) {
      this.deathBy(sender);
    }
    this.set({
      health: h
    });
    return this.animateHealth();
  };
  Creature.prototype.animateHealth = function() {
    h = this.get('health');
    percentage = 100 / this.get('maxHealth') * h;
    return this.healthBar.find('span').stop().animate({
      width: "" + percentage + "%"
    }, 1000);
  };
  Creature.prototype.deathBy = function(sender) {
    app.log("You killed a " + (this.getName()));
    return this.hide();
  };
  Creature.prototype.collidesWith = function(position) {
    return this.getPosition().distanceTo(position) < 100;
  };
  Creature.prototype.nearbyCreatures = function() {
    id = this.cid;
    return _(Creatures.select(__bind(function(creature) {
      return creature.cid !== id;
    }, this)));
  };
  Creature.prototype.creatureCollision = function(position) {
    return this.nearbyCreatures().find(__bind(function(creature) {
      return creature.getPosition().distanceTo(position) < this.radius.length();
    }, this));
  };
  Creature.prototype.getGroundHeight = function(position) {
    if (!position) {
      position = new Vector(this.get('x'), this.get('y'), 0);
    }
    return this.getStack(position).height(position.x, position.y);
  };
  Creature.prototype.getStack = function(position) {
    if (!position) {
      position = this.getPosition();
    }
    x = Math.floor(position.x / 100);
    y = Math.floor(position.y / 80);
    return (typeof app !== "undefined" && app !== null) && app.map.get(x, y);
  };
  Creature.prototype.verbs = function() {
    return [];
  };
  Creature.prototype.onMouseOver = function() {
    return this.healthBar.show();
  };
  Creature.prototype.onMouseOut = function() {
    return this.healthBar.hide();
  };
  Creature.prototype.onclick = function(e) {
    player = app.player;
    menu = new PopupMenu(e);
    menu.setName(this.getName());
    menu.setDescription(this.getDescription());
    _ref = this.verbs();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      verb = _ref[_i];
      func = this[verb.getCallbackName()];
      if (player.canPerform(verb)) {
        menu.addMenuItem(verb.getName(), verb.getDescription(), __bind(function() {
          return func.call(this, player);
        }, this));
      } else {
        menu.addDisabledMenuItem(verb.getName(), verb.getRequirements());
      }
    }
    menu.show();
    e.preventDefault();
    return e.stopPropagation();
  };
  Creature.prototype.createElements = function() {
    this.div = $("<div />").addClass('creature').hide();
    this.div.appendTo('#playfield');
    this.shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo(this.div);
    this.icon = $("<img />").attr('src', '/images/creatures/zombie.png').addClass('icon').appendTo(this.div);
    this.healthBar = $("<div />").addClass('healthbar').html("<span />").appendTo(this.div);
    this.animateHealth();
    this.healthBar.hide();
    this.icon.click(this.onclick);
    this.redraw();
    return this.show();
  };
  Creature.prototype.notifyAction = function(text) {
    y = parseInt(this.icon.css('top')) + 10;
    label = $("<label />").text(text).addClass('action');
    label.appendTo(this.div);
    return label.css({
      top: y
    }).animate({
      top: y - 15
    }, 1000, 'linear').animate({
      top: y - 30,
      opacity: 0
    }, 1000, 'linear', __bind(function() {
      return label.remove();
    }, this));
  };
  Creature.prototype.show = function() {
    this.redraw();
    this.div.show();
    return this.onShow ? this.onShow() : void 0;
  };
  Creature.prototype.hide = function() {
    this.div.hide();
    return this.onHide ? this.onHide() : void 0;
  };
  Creature.prototype.getPosition = function() {
    return new Vector(this.get('x'), this.get('y'), this.getGroundHeight());
  };
  Creature.prototype.setPosition = function(p) {
    return this.set({
      x: p.x,
      y: p.y,
      z: p.z
    });
  };
  Creature.prototype.remove = function() {
    this.div.hide().remove();
    return this.div = null;
  };
  Creature.prototype.redraw = function() {
    if (!this.div) {
      this.createElements();
    }
    position = this.getPosition();
    width = 70;
    height = 70;
    altitude = app.map.getHeightByPoint(position);
    this.div.css({
      top: position.y - 10,
      left: position.x,
      'z-index': parseInt(position.y + altitude) + 10
    });
    anchor = 22;
    this.icon.css({
      width: width,
      height: height,
      top: 0 - altitude - height + anchor,
      left: -width / 2
    });
    return this.shadow.css({
      top: 0 - altitude - 10,
      width: width,
      left: -width / 2
    });
  };
  Creatures = new Backbone.Collection;
  Creatures.model = Creature;
  this.Creatures = Creatures;
  this.Creature = Creature;
}).call(this);
