(function() {
  var Map;
  var __hasProp = Object.prototype.hasOwnProperty;
  Map = (function() {
    function Map() {
      this.stacks = {};
      this.gridDimensions = new Vector(100, 80, 0);
      this.gridWidth = this.gridDimensions.x;
      this.gridHeight = this.gridDimensions.y;
      this.maxY = 4;
      this.maxX = 50;
      this.gravity = 50;
      return this;
    }
    return Map;
  })();
  Map.prototype.getExtents = function() {
    return new Vector(this.maxX, this.maxY);
  };
  Map.prototype.getWidth = function() {
    return this.maxX;
  };
  Map.prototype.getHeight = function() {
    return this.maxY;
  };
  Map.prototype.getGridWidth = function() {
    return this.gridWidth;
  };
  Map.prototype.getGridHeight = function() {
    return this.gridHeight;
  };
  Map.prototype.getDimensions = function() {
    return new Vector(this.maxX * this.gridWidth, this.maxY * this.gridHeight);
  };
  Map.prototype.autogenerate = function() {
    var _result, _result2, _result3, _to, _to2, _to3, _to4, dirt, grass, h, j, stack, w, x, xx, y, yy;
    x = 4;
    y = 0;
    w = 0;
    h = this.maxY - 1;
    grass = GrassTile;
    dirt = Assets.find(function(asset) {
      return asset.get('name').match(/dirt/i);
    });
    for (xx = x, _to = x + w; xx <= _to; xx++) {
      for (yy = y, _to2 = y + h; yy <= _to2; yy++) {
        stack = this.get(xx, yy);
        if (!stack.isFull()) {
          stack.newTile(grass);
        }
      }
    }
    _result = [];
    for (j = 1; j <= 10; j++) {
      x = Math.floor(Math.random() * this.maxX) + 4;
      y = Math.floor(Math.random() * this.maxY - 1) + 1;
      w = Math.floor(Math.random() * 4);
      h = Math.floor(Math.random() * Math.min(3, this.maxY - y));
      _result.push((function() {
        _result2 = [];
        for (xx = x, _to3 = x + w; xx <= _to3; xx++) {
          _result2.push((function() {
            _result3 = [];
            for (yy = y, _to4 = y + h; yy <= _to4; yy++) {
              stack = this.get(xx, yy);
              _result3.push(!stack.isFull() ? stack.newTile(Math.random() < 0.5 ? dirt : GrassTile) : void 0);
            }
            return _result3;
          }).call(this));
        }
        return _result2;
      }).call(this));
    }
    return _result;
  };
  Map.prototype.addItems = function() {
    var _result, item, j, position, rock, stack, tree, x, y;
    tree = Items.find(function(item) {
      return item.get('name').match(/tree/i);
    });
    rock = Items.find(function(item) {
      return item.get('name').match(/rock/i);
    });
    _result = [];
    for (j = 1; j <= 50; j++) {
      x = Math.floor(Math.random() * this.maxX);
      y = Math.floor(Math.random() * this.maxY - 1) + 1;
      stack = this.get(x, y);
      position = stack.getCenter();
      item = Math.random() < 0.5 ? rock.clone() : tree.clone();
      item.set({
        x: position.x,
        y: position.y
      });
      _result.push(item.show());
    }
    return _result;
  };
  Map.prototype.get = function(x, y) {
    var index;
    if ((y < 0) || (y >= this.maxY)) {
      return null;
    }
    index = "" + x + "," + y;
    if (!this.stacks[index]) {
      this.stacks[index] = new Stack(this, x, y);
    }
    return this.stacks[index];
  };
  Map.prototype.ellipseIntersection = function(position, radius) {
    var height1, height2, pos1, pos2;
    pos1 = position.add(radius);
    pos2 = position.subtract(radius);
    height1 = this.get(Math.floor(pos1.x / this.gridWidth), Math.floor(pos1.y / this.gridHeight)).height(pos1.x, pos1.y);
    height2 = this.get(Math.floor(pos2.x / this.gridWidth), Math.floor(pos2.y / this.gridHeight)).height(pos2.x, pos2.y);
    return height1 !== height2;
  };
  Map.prototype.getHeightByRadius = function(position, radius) {
    var height1, height2, pos1, pos2;
    pos1 = position.add(radius);
    pos2 = position.subtract(radius);
    height1 = this.get(Math.floor(pos1.x / this.gridWidth), Math.floor(pos1.y / this.gridHeight)).height(pos1.x, pos1.y);
    height2 = this.get(Math.floor(pos2.x / this.gridWidth), Math.floor(pos2.y / this.gridHeight)).height(pos2.x, pos2.y);
    return Math.max(height1, height2);
  };
  Map.prototype.getHeightByPoint = function(position) {
    return this.get(Math.floor(position.x / this.gridWidth), Math.floor(position.y / this.gridHeight)).height(position.x, position.y);
  };
  Map.prototype.save = function() {
    return $.ajax({
      url: '/map',
      type: 'POST',
      dataType: 'json',
      data: this.toJSON()
    });
  };
  Map.prototype.empty = function() {
    return this.stacks = {};
  };
  Map.prototype.refresh = function(collection) {
    var _i, _len, _ref, _result, index, stack;
    this.empty();
    for (_i = 0, _len = collection.length; _i < _len; _i++) {
      stack = collection[_i];
      this.get(stack.x, stack.y).set(stack);
    }
    _result = [];
    for (index in _ref = this.stacks) {
      if (!__hasProp.call(_ref, index)) continue;
      stack = _ref[index];
      _result.push(stack.redrawShadows());
    }
    return _result;
  };
  Map.prototype.toJSON = function() {
    var _ref, index, params, stack;
    params = {};
    for (index in _ref = this.stacks) {
      if (!__hasProp.call(_ref, index)) continue;
      stack = _ref[index];
      if (!stack.isEmpty()) {
        params[index] = stack.toJSON();
      }
    }
    return {
      stacks: params
    };
  };
  this.Map = Map;
}).call(this);
