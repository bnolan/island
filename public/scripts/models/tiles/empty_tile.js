(function() {
  var EmptyTile;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
    child.__super__ = parent.prototype;
    return child;
  };
  EmptyTile = function() {
    function EmptyTile(stack) {
      EmptyTile.__super__.constructor.call(this, stack);
    }
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
    return EmptyTile;
  }();
  this.EmptyTile = EmptyTile;
}).call(this);
