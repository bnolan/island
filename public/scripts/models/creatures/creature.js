(function() {
  var Creature;
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
      Creature.__super__.constructor.apply(this, arguments);
      return this;
    }
    return Creature;
  })();
  __extends(Creature, Model);
  Creature.prototype.createElements = function() {
    this.div = $("<div />").addClass('creature').hide();
    this.div.appendTo('#playfield');
    this.shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo(this.div);
    this.icon = $("<img />").attr('src', '/images/creatures/zombie.png').addClass('icon').appendTo(this.div);
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
    return new Vector(this.get('x'), this.get('y'), 0);
  };
  Creature.prototype.setPosition = function(p) {
    return this.set({
      x: p.x,
      y: p.y,
      z: p.z
    });
  };
  Creature.prototype.onclick = function(e) {};
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
      top: position.y,
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
  this.Creature = Creature;
}).call(this);
