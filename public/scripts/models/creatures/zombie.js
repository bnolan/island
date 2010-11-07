(function() {
  var Zombie;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  Zombie = (function() {
    function Zombie() {
      return Creature.apply(this, arguments);
    }
    return Zombie;
  })();
  __extends(Zombie, Creature);
  Zombie.prototype.tick = function(period) {
    var a, attacks, b, p, player, speed, v;
    this.radius = new Vector(30, 30, 0);
    speed = 50;
    attacks = 0.2;
    p = this.getPosition();
    a = this.get('attack') || 0;
    b = this.get('brains') || Math.random() * 2 + 2;
    player = Players.findNearestTo(this.getPosition()).first();
    if (player.getPosition().x + player.radius.x + this.radius.x < p.x) {
      p.x -= period * speed;
    } else if (player.getPosition().x - player.radius.x - this.radius.x > p.x) {
      p.x += period * speed;
    }
    if (player.getPosition().y + player.radius.y + this.radius.y < p.y) {
      p.y -= period * speed;
    } else if (player.getPosition().y - player.radius.y - this.radius.x > p.y) {
      p.y += period * speed;
    }
    v = player.getPosition();
    if (v.subtract(p).length() < this.radius.x + player.radius.x + 5) {
      a -= period;
      if (a <= 0) {
        a = 1 / attacks;
        this.notifyAction("OM NOM NOM");
      }
    } else {
      b -= period;
      if (b <= 0) {
        b = Math.random() * 5 + 5;
        this.notifyAction("BRAAAINS");
      }
    }
    this.setPosition(p);
    return this.set({
      attack: a,
      brains: b
    });
  };
  this.Zombie = Zombie;
}).call(this);
