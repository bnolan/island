(function() {
  var Vector;
  Vector = (function() {
    function Vector(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      return this;
    }
    return Vector;
  })();
  Vector.prototype.copy = function() {
    return new Vector(this.x, this.y, this.z);
  };
  Vector.prototype.inverse = function() {
    return new Vector(-this.x, -this.y, -this.z);
  };
  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  };
  Vector.prototype.distanceTo = function(v) {
    return this.subtract(v).length();
  };
  Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  };
  Vector.prototype.toString = function() {
    return "" + this.x + "," + this.y + "," + this.z;
  };
  Vector.prototype.toWire = function() {
    var _i, _len, _ref, _result, component;
    _ref = [this.x, this.y, this.z];
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      _result.push(Math.floor(component));
    }
    return _result;
  };
  Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };
  this.Vector = Vector;
}).call(this);
