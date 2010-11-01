(function() {
  var Map;
  var __hasProp = Object.prototype.hasOwnProperty;
  Map = (function() {
    function Map() {
      this.stacks = {};
      this.gridWidth = 100;
      this.gridHeight = 80;
      return this;
    }
    return Map;
  })();
  Map.prototype.get = function(x, y) {
    var index;
    index = "" + x + "," + y;
    if (!this.stacks[index]) {
      this.stacks[index] = new Stack(this, x, y);
    }
    return this.stacks[index];
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
