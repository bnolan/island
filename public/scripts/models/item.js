(function() {
  var Item, Items;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
    child.__super__ = parent.prototype;
    return child;
  };
  Item = function() {
    function Item() {
      this.onclick = __bind(this.onclick, this);;
      Item.__super__.constructor.apply(this, arguments);
      this.evalCode();
    }
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
      var behaviours, func, name, _results;
      behaviours = null;
      try {
        eval("behaviours = " + this.get("code"));
      } catch (e) {
        console.log(e);
      }
      if (behaviours) {
        _results = [];
        for (name in behaviours) {
          if (!__hasProp.call(behaviours, name)) continue;
          func = behaviours[name];
          _results.push(this[name] = func);
        }
        return _results;
      }
    };
    Item.prototype.show = function() {
      this.redraw();
      this.div.show();
      if (this.onShow) {
        return this.onShow();
      }
    };
    Item.prototype.hide = function() {
      this.div.hide();
      if (this.onHide) {
        return this.onHide();
      }
    };
    Item.prototype.getPosition = function() {
      return new Vector(this.get('x'), this.get('y'), 0);
    };
    Item.prototype.onclick = function(e) {
      var position, ul, _fn, _i, _len, _ref;
      position = this.div.offset();
      ul = $(".menu").hide().find('ul').empty();
      $(".menu .description").text(this.get('description'));
      $(".menu .name").text(this.get('name'));
      if (this.getVerbs) {
        _ref = this.getVerbs();
        _fn = function(verb) {
          var func;
          func = this["onVerb" + (verb.capitalize())];
          return $("<li />").text(verb.capitalize()).appendTo(ul).click(__bind(function(e) {
            $(".menu").fadeOut();
            e.preventDefault();
            return func.call(this, app.player);
          }, this));
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          verb = _ref[_i];
          _fn.call(this, verb);
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
      var altitude, anchor, height, position, width;
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
    return Item;
  }();
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
