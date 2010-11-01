(function() {
  var Item, Items;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  Item = (function() {
    function Item() {
      var _this;
      _this = this;
      this.onclick = function() { return Item.prototype.onclick.apply(_this, arguments); };
      Item.__super__.constructor.apply(this, arguments);
      this.div = $("<div />").addClass('item');
      this.asset = Assets.get(38);
      this.icon = $("<img />").attr('src', this.asset.get('upload_url')).addClass('icon').appendTo(this.div);
      this.shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo(this.div);
      this.div.click(this.onclick);
      this.redraw();
      this.icon.hide().effect('bounce', {
        mode: 'show',
        times: 3,
        distance: 50
      }, 250);
      return this;
    }
    return Item;
  })();
  __extends(Item, Model);
  Item.prototype.getPosition = function() {
    return new Vector(this.get('x'), this.get('y'), 0);
  };
  Item.prototype.onclick = function(e) {
    position = this.div.offset();
    $(".menu").css({
      left: position.left - 275,
      top: position.top - 300
    }).hide().fadeIn();
    return e.preventDefault();
  };
  Item.prototype.redraw = function() {
    if (this.div.parent().length === 0) {
      this.div.appendTo('#playfield').hide().fadeIn();
    }
    position = this.getPosition();
    height = 120;
    altitude = app.map.getHeightByPoint(position);
    this.div.css({
      top: position.y,
      left: position.x,
      'z-index': parseInt(position.y + altitude) + 10
    });
    this.icon.css({
      top: 0 - altitude - height - 15,
      left: -50
    });
    return this.shadow.css({
      top: 0 - altitude - 20,
      left: -25
    });
  };
  Items = new Backbone.Collection;
  Items.model = Item;
  this.Items = Items;
  this.Item = Item;
}).call(this);
