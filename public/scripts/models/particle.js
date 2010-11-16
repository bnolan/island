(function() {
  var Particle;
  Particle = (function() {
    function Particle(map) {
      var _this;
      _this = this;
      this.tick = function() { return Particle.prototype.tick.apply(_this, arguments); };
      this.map = map;
      this.position = app.player.getPosition().copy();
      this.position.z += 30;
      this.velocity = new Vector(200, 0, 0);
      this.div = $("<div />").addClass('particle').appendTo('#playfield');
      this.draw();
      this.bounciness = 0.8;
      this.weight = 0;
      this.interval = setInterval(this.tick, 1 / 30);
      return this;
    }
    return Particle;
  })();
  Particle.prototype.tick = function(period) {
    period = 1 / 30;
    this.position = this.position.add(this.velocity.multiply(period));
    this.velocity.z += this.map.gravity * period * this.weight;
    if (this.map.getHeightByPoint(this.position) > this.position.z) {
      this.destroy();
    }
    this.draw();
    return this.checkCollisions();
  };
  Particle.prototype.checkCollisions = function() {
    _ref = Creatures.models;
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      creature = _ref[_i];
      _result.push(creature.getPosition().distanceTo(this.position) < creature.radius.length() + 30 ? this.onCollide(creature) : void 0);
    }
    return _result;
  };
  Particle.prototype.onCollide = function(sender) {
    if (sender instanceof Creature) {
      return sender.deathBy(app.player);
    } else {
      throw "Unimplemented";
    }
  };
  Particle.prototype.destroy = function() {
    clearInterval(this.interval);
    return this.div.remove();
  };
  Particle.prototype.draw = function() {
    return this.div.css({
      left: this.position.x,
      top: this.position.y - this.position.z
    });
  };
  this.Particle = Particle;
}).call(this);
