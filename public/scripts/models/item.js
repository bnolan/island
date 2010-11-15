(function() {
  var Item, Items;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __hasProp = Object.prototype.hasOwnProperty, __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Item = (function() {
    function Item() {
      var _this;
      _this = this;
      this.onclick = function() { return Item.prototype.onclick.apply(_this, arguments); };
      Item.__super__.constructor.apply(this, arguments);
      this.evalCode();
      return this;
    }
    return Item;
  })();
  __extends(Item, Model);
  Item.prototype.createElements = function() {
    this.div = $("<div />").addClass('item').hide();
    this.div.appendTo('#playfield');
    this.asset = Assets.get(this.get('asset_id'));
    this.shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo(this.div);
    this.icon = $("<img />").attr('src', this.asset.get('upload_url')).addClass('icon').appendTo(this.div);
    this.icon.click(this.onclick);
    this.redraw();
    return this.show();
  };
  Item.prototype.evalCode = function() {
    behaviours = null;
    try {
      eval("behaviours = " + this.get("code"));
    } catch (e) {
      console.log(e);
    }
    if (behaviours) {
      _result = [];
      for (name in behaviours) {
        if (!__hasProp.call(behaviours, name)) continue;
        func = behaviours[name];
        _result.push(this[name] = func);
      }
      return _result;
    }
  };
  Item.prototype.show = function() {
    this.redraw();
    this.div.show();
    return this.onShow ? this.onShow() : void 0;
  };
  Item.prototype.hide = function() {
    this.div.hide();
    return this.onHide ? this.onHide() : void 0;
  };
  Item.prototype.getPosition = function() {
    return new Vector(this.get('x'), this.get('y'), 0);
  };
  Item.prototype.onclick = function(e) {
    position = this.div.offset();
    ul = $(".menu").hide().find('ul').empty();
    $(".menu .description").text(this.get('description'));
    $(".menu .name").text(this.get('name'));
    if (this.getVerbs) {
      _ref = this.getVerbs();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        verb = _ref[_i];
        func = this["onVerb" + (verb.capitalize())];
        $("<li />").text(verb.capitalize()).appendTo(ul).click(__bind(function(e) {
          $(".menu").fadeOut();
          e.preventDefault();
          return func.call(this, app.player);
        }, this));
      }
    }
    $(".menu").css({
      left: e.clientX - 80,
      top: e.clientY - $(".menu").height() - 40
    }).fadeIn();
    e.preventDefault();
    return e.stopPropagation();
  };
  Item.prototype.remove = function() {
    this.div.hide().remove();
    return this.div = null;
  };
  Item.prototype.redraw = function() {
    if (!this.div) {
      this.createElements();
    }
    position = this.getPosition();
    height = this.get('height');
    altitude = app.map.getHeightByPoint(position);
    this.div.css({
      top: position.y,
      left: position.x,
      'z-index': parseInt(position.y + altitude) + 10
    });
    width = this.get('width');
    height = this.get('height');
    anchor = this.asset.get('anchor_y') || 0;
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
  Items = new Backbone.Collection;
  Items.model = Item;
  Items.findByName = function(name) {
    return Items.find(function(item) {
      return item.get('name') === name;
    });
  };
  this.Items = Items;
  this.Item = Item;
}).call(this);
