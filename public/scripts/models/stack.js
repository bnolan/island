(function() {
  var GroundHeight, Stack;
  GroundHeight = -1000;
  Stack = (function() {
    function Stack(map, x, y) {
      this.map = map;
      this.tiles = [];
      this.x = x;
      this.y = y;
      return this;
    }
    return Stack;
  })();
  Stack.prototype.set = function(params) {
    var _i, _len, _ref, id;
    this.tiles = [];
    _ref = params.tiles.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      this.newTile(Assets.get(id));
    }
    return this.redraw();
  };
  Stack.prototype.redraw = function() {};
  Stack.prototype.height = function(x, y) {
    if (this.isEmpty()) {
      return GroundHeight;
    } else {
      x = (x - this.x * 100) / 100;
      y = (y - this.y * 100) / 100;
      return (this.tiles.length - 1) * 40 + this.getTop().getHeight(x, y);
    }
  };
  Stack.prototype.toJSON = function() {
    return {
      x: this.x,
      y: this.y,
      tiles: _(this.tiles).invoke('toJSON')
    };
  };
  Stack.prototype.redrawShadows = function() {
    if (this.isEmpty()) {} else {
      return this.getTop().redrawShadows();
    }
  };
  Stack.prototype.stackingHeight = function() {
    return this.isEmpty() ? GroundHeight : this.tiles.length * 40;
  };
  Stack.prototype.push = function(tile) {
    this.tiles.push(tile);
    return tile.draw();
  };
  Stack.prototype.newTile = function(asset) {
    var tile;
    tile = new Tile(this, asset);
    return this.push(tile);
  };
  Stack.prototype.getTop = function() {
    return this.isEmpty() ? null : this.tiles[this.tiles.length - 1];
  };
  Stack.prototype.pop = function(tile) {
    return this.tiles.pop();
  };
  Stack.prototype.westernNeighbour = function() {
    return this.getNeighbour(this.x - 1, this.y);
  };
  Stack.prototype.easternNeighbour = function() {
    return this.getNeighbour(this.x + 1, this.y);
  };
  Stack.prototype.northernNeighbour = function() {
    return this.getNeighbour(this.x, this.y - 1);
  };
  Stack.prototype.northWesternNeighbour = function() {
    return this.getNeighbour(this.x - 1, this.y - 1);
  };
  Stack.prototype.southernNeighbour = function() {
    return this.getNeighbour(this.x, this.y + 1);
  };
  Stack.prototype.getNeighbour = function(x, y) {
    return this.map.get(x, y);
  };
  Stack.prototype.getNeighbours = function() {
    return _.compact([this.getNeighbour(this.x - 1, y - 1), this.getNeighbour(this.x, y - 1), this.getNeighbour(this.x + 1, y - 1), this.getNeighbour(this.x + 1, y), this.getNeighbour(this.x + 1, y + 1), this.getNeighbour(this.x, y + 1), this.getNeighbour(this.x - 1, y + 1), this.getNeighbour(this.x - 1, y)]);
  };
  Stack.prototype.isEmpty = function() {
    return this.tiles.length === 0;
  };
  this.Stack = Stack;
}).call(this);
