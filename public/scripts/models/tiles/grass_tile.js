(function() {
  var GrassTile;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  GrassTile = (function() {
    function GrassTile(stack) {
      var asset;
      asset = Assets.find(function(asset) {
        return asset.get('name').match(/grass/i);
      });
      GrassTile.__super__.constructor.call(this, stack, asset);
      return this;
    }
    return GrassTile;
  })();
  __extends(GrassTile, Tile);
  GrassTile.prototype.tick = function(seconds) {
    var mass, maxBiomass, rate;
    rate = 0.1;
    maxBiomass = 50;
    mass = Math.clamp(this.get('biomass') + rate * seconds, 0, 50);
    return this.set({
      biomass: mass
    });
  };
  GrassTile.prototype.verbs = function() {
    return [Verb.dig];
  };
  GrassTile.prototype.onVerbDig = function(player) {
    var item;
    item = Items.findByName("Compost");
    return player.doAction("Digging", "5", __bind(function() {
      return this.remove();
    }, this));
  };
  GrassTile.prototype.getName = function() {
    return "Grass";
  };
  GrassTile.prototype.getDescription = function() {
    return "Lush green grass with dew glistening and the fresh smell of summer.";
  };
  this.GrassTile = GrassTile;
}).call(this);
