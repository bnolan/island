(function() {
  var EmptyTile;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  EmptyTile = (function() {
    function EmptyTile(stack) {
      EmptyTile.__super__.constructor.call(this, stack);
      return this;
    }
    return EmptyTile;
  })();
  __extends(EmptyTile, Tile);
  EmptyTile.prototype.verbs = function() {
    return [];
  };
  EmptyTile.prototype.getName = function() {
    return "Empty block";
  };
  EmptyTile.prototype.getDescription = function() {
    return "Just an empty bit of ground.";
  };
  this.EmptyTile = EmptyTile;
}).call(this);
