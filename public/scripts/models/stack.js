(function() {
  var GroundHeight, Stack;
  GroundHeight = 0;
  Stack = function() {
    function Stack(map, x, y) {
      this.map = map;
      this.tiles = [];
      this.x = x;
      this.y = y;
      this.emptyTile = new EmptyTile(this);
    }
    Stack.prototype.set = function(params) {
      var id, _i, _len, _ref;
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
      if (this.isEmpty()) {
        return this.emptyTile.redrawShadows();
      } else {
        return this.getTop().redrawShadows();
      }
    };
    Stack.prototype.stackingHeight = function() {
      if (this.isEmpty()) {
        return GroundHeight;
      } else {
        return this.tiles.length * 40;
      }
    };
    Stack.prototype.pop = function() {
      var stack, _i, _len, _ref;
      this.tiles.pop();
      _ref = this.getNeighbours();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        stack.redrawShadows();
      }
      return this.redrawShadows();
    };
    Stack.prototype.push = function(tile) {
      this.tiles.push(tile);
      return tile.draw();
    };
    Stack.prototype.newTile = function(asset) {
      var tile;
      if (typeof asset === 'function') {
        tile = new asset(this);
      } else {
        tile = new Tile(this, asset);
      }
      return this.push(tile);
    };
    Stack.prototype.getTop = function() {
      if (this.isEmpty()) {
        return null;
      } else {
        return this.tiles[this.tiles.length - 1];
      }
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
      return _.compact([this.getNeighbour(this.x - 1, this.y - 1), this.getNeighbour(this.x, this.y - 1), this.getNeighbour(this.x + 1, this.y - 1), this.getNeighbour(this.x + 1, this.y), this.getNeighbour(this.x + 1, this.y + 1), this.getNeighbour(this.x, this.y + 1), this.getNeighbour(this.x - 1, this.y + 1), this.getNeighbour(this.x - 1, this.y)]);
    };
    Stack.prototype.isEmpty = function() {
      return this.tiles.length === 0;
    };
    Stack.prototype.isFull = function() {
      return this.tiles.length >= 3;
    };
    Stack.prototype.getCenter = function() {
      return new Vector((this.x + 0.5) * this.map.gridWidth, (this.y + 0.5) * this.map.gridHeight);
    };
    return Stack;
  }();
  this.Stack = Stack;
}).call(this);
