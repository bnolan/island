(function() {
  var Creature, Creatures;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
    child.__super__ = parent.prototype;
    return child;
  };
  Creature = function() {
    function Creature() {
      this.onclick = __bind(this.onclick, this);;
      Creature.__super__.constructor.apply(this, arguments);
    }
    __extends(Creature, Model);
    Creature.prototype.getHealth = function() {
      return this.get('health');
    };
    Creature.prototype.addHealth = function(x, sender) {
      var h;
      h = this.get('health');
      h = Math.min(this.health + x, this.maxHealth);
      this.set({
        health: h
      });
      return this.animateHealth();
    };
    Creature.prototype.removeHealth = function(x, sender) {
      var h;
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
      var h, percentage;
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
    Creature.prototype.ellipseGroundIntersection = function(position, radius) {};
    Creature.prototype.getGroundHeight = function(position) {
      if (!position) {
        position = this.getPosition();
      }
      return this.getStack(position).height(position.x, position.y);
    };
    Creature.prototype.getStack = function(position) {
      var x, y;
      if (!position) {
        position = this.getPosition();
      }
      x = Math.floor(position.x / 100);
      y = Math.floor(position.y / 80);
      return (typeof app != "undefined" && app !== null) && app.map.get(x, y);
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
      var menu, player, _fn, _i, _len, _ref;
      player = app.player;
      menu = new PopupMenu(e);
      menu.setName(this.getName());
      menu.setDescription(this.getDescription());
      _ref = this.verbs();
      _fn = function(verb) {
        var func;
        func = this[verb.getCallbackName()];
        if (player.canPerform(verb)) {
          return menu.addMenuItem(verb.getName(), verb.getDescription(), __bind(function() {
            return func.call(this, player);
          }, this));
        } else {
          return menu.addDisabledMenuItem(verb.getName(), verb.getRequirements());
        }
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        verb = _ref[_i];
        _fn.call(this, verb);
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
      var label, y;
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
      if (this.onShow) {
        return this.onShow();
      }
    };
    Creature.prototype.hide = function() {
      this.div.hide();
      if (this.onHide) {
        return this.onHide();
      }
    };
    Creature.prototype.getPosition = function() {
      return new Vector(this.get('x'), this.get('y'), 0);
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
      var altitude, anchor, height, position, width;
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
    return Creature;
  }();
  Creatures = new Backbone.Collection;
  Creatures.model = Creature;
  this.Creatures = Creatures;
  this.Creature = Creature;
}).call(this);
