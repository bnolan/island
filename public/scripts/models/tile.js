(function() {
  var Tile;
  Tile = (function() {
    function Tile(stack, asset) {
      this.stack = stack;
      this.asset = asset;
      this.gridWidth = 100;
      this.gridHeight = 80;
      this.div = $("<div />").addClass('tile');
      this.img = $("<img />").attr('src', this.asset.getImageUrl()).appendTo(this.div);
      return this;
    }
    return Tile;
  })();
  Tile.prototype.draw = function() {
    var _i, _len, _ref, _result, height, stack, x, y;
    x = this.stack.x;
    y = this.stack.y;
    height = this.stack.stackingHeight();
    this.div.css({
      position: 'absolute',
      left: x * this.gridWidth,
      top: y * this.gridHeight - this.div.height() - 50 - height,
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
  Tile.prototype.redrawShadows = function() {
    if (this.drawShadow()) {
      this.div.find('.shadow').remove();
      if (this.stack.westernNeighbour() && (this.stack.westernNeighbour().stackingHeight() > this.stack.stackingHeight())) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo(this.div);
      }
      if (this.stack.easternNeighbour() && (this.stack.easternNeighbour().stackingHeight() > this.stack.stackingHeight())) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo(this.div);
      }
      return this.stack.northernNeighbour() && (this.stack.northernNeighbour().stackingHeight() > this.stack.stackingHeight()) ? $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo(this.div) : void 0;
    }
  };
  Tile.prototype.getHeight = function(x, y) {
    return this.isRamp() ? (this.asset.get('height_east') - this.asset.get('height_west')) * x + this.asset.get('height_west') : 40;
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
