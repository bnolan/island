(function() {
  var Tile;
  var __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Tile = (function() {
    function Tile(stack, asset) {
      var _this;
      _this = this;
      this.onclick = function() { return Tile.prototype.onclick.apply(_this, arguments); };
      this.stack = stack;
      this.asset = asset;
      this.gridWidth = 100;
      this.gridHeight = 80;
      this.div = $("<div />").addClass('tile');
      this.img = $("<img />").attr('src', this.asset.getImageUrl()).appendTo(this.div);
      this.div.click(this.onclick);
      return this;
    }
    return Tile;
  })();
  Tile.prototype.draw = function() {
    x = this.stack.x;
    y = this.stack.y;
    height = this.stack.stackingHeight();
    this.div.css({
      position: 'absolute',
      left: x * this.gridWidth,
      top: y * this.gridHeight - this.div.height() - 5 - height,
      'z-index': y * this.gridHeight + height
    });
    $("<label>" + x + "," + y + "," + height + "</label>").appendTo(this.div);
    if (this.div.parent().length === 0) {
      this.div.appendTo('#playfield');
    }
    this.redrawShadows();
    _ref = this.stack.getNeighbours();
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stack = _ref[_i];
      _result.push(stack.redrawShadows());
    }
    return _result;
  };
  Tile.prototype.remove = function() {
    this.stack.pop();
    return this.div.remove();
  };
  Tile.prototype.redrawShadows = function() {
    this.div.find('.shadow').remove();
    if (this.drawShadow()) {
      if (this.stack.westernNeighbour().stackingHeight() > this.stack.stackingHeight()) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo(this.div);
      }
      if (this.stack.easternNeighbour().stackingHeight() > this.stack.stackingHeight()) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo(this.div);
      }
      return this.stack.northernNeighbour().stackingHeight() > this.stack.stackingHeight() ? $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo(this.div) : void 0;
    }
  };
  Tile.prototype.getHeight = function(x, y) {
    return this.isRamp() ? (this.asset.get('height_east') - this.asset.get('height_west')) * x + this.asset.get('height_west') : 40;
  };
  Tile.prototype.getName = function() {
    return this.asset.get('name');
  };
  Tile.prototype.getDescription = function() {
    return "";
  };
  Tile.prototype.onclick = function(e) {
    position = this.div.offset();
    ul = $(".menu").css({
      left: e.clientX - 80,
      top: e.clientY - 90
    }).hide().find('ul').empty();
    $(".menu .description").text(this.getDescription());
    $(".menu .name").text(this.getName());
    $("<li />").text("Destroy").appendTo(ul).click(__bind(function(e) {
      $(".menu").fadeOut();
      e.preventDefault();
      return this.onDestroy(app.player);
    }, this));
    $(".menu").css({
      left: e.clientX - 80,
      top: e.clientY - $(".menu").height() - 40
    }).fadeIn();
    e.preventDefault();
    return e.stopPropagation();
  };
  Tile.prototype.onDestroy = function() {
    return this.remove();
  };
  Tile.prototype.isRamp = function() {
    return this.asset.get('name').match(/ramp/i);
  };
  Tile.prototype.isDeadly = function() {
    return this.isLava() || this.isWater();
  };
  Tile.prototype.isLava = function() {
    return this.asset.get('name').match(/lava/i);
  };
  Tile.prototype.isWater = function() {
    return this.asset.get('name').match(/water/i);
  };
  Tile.prototype.drawShadow = function() {
    if (this.isRamp()) {
      return false;
    }
    return true;
  };
  Tile.prototype.toJSON = function() {
    return {
      asset_id: this.asset.id
    };
  };
  this.Tile = Tile;
}).call(this);
