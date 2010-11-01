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
  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  };
  Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  };
  this.Vector = Vector;
}).call(this);
