(function() {
  var Particle;
  Particle = (function() {
    function Particle(map) {
      var _this;
      _this = this;
      this.tick = function() { return Particle.prototype.tick.apply(_this, arguments); };
      this.map = map;
      this.position = app.player.getPosition().copy();
      this.position.z = -100;
      this.velocity = new Vector(100, 0, -50);
      this.div = $("<div />").addClass('particle').appendTo('#playfield');
      this.draw();
      this.bounciness = 0.8;
      setInterval(this.tick, 1 / 30);
      return this;
    }
    return Particle;
  })();
  Particle.prototype.tick = function(period) {
    period = 1 / 30;
    this.position = this.position.add(this.velocity.multiply(period));
    this.velocity.z += this.map.gravity * period;
    if (this.map.getHeightByPoint(this.position) < this.position.z) {
      this.velocity.z *= -this.bounciness;
    }
    return this.draw();
  };
  Particle.prototype.draw = function() {
    return this.div.css({
      left: this.position.x,
      top: this.position.y + this.position.z
    });
  };
  this.Particle = Particle;
}).call(this);
