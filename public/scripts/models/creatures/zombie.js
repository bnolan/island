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
      var _this;
      _this = this;
      this.onVerbBash = function() { return Zombie.prototype.onVerbBash.apply(_this, arguments); };
      return Creature.apply(this, arguments);
    }
    return Zombie;
  })();
  __extends(Zombie, Creature);
  Zombie.prototype.getName = function() {
    return "Level 1 Zombie";
  };
  Zombie.prototype.getDescription = function() {
    return "It looks hungry. I think it wants your brains.";
  };
  Zombie.prototype.verbs = function() {
    return [Verb.bash];
  };
  Zombie.prototype.onVerbBash = function(sender) {
    this.removeHealth(3.5, sender);
    return console.log('ow!');
  };
  Zombie.prototype.tick = function(period) {
    this.radius = new Vector(25, 25, 0);
    this.attackRadius = 80;
    speed = 100;
    attacks = 0.2;
    old = this.getPosition();
    p = this.getPosition();
    gh = this.map.getHeightByRadius(p, this.radius);
    a = this.get('attack') || 0;
    b = this.get('brains') || Math.random() * 2 + 2;
    player = Players.findNearestTo(this.getPosition()).first();
    if (player.getPosition().x + player.radius.x + this.radius.x < p.x) {
      p.x -= period * speed;
    } else if (player.getPosition().x - player.radius.x - this.radius.x > p.x) {
      p.x += period * speed;
    }
    if (gh !== this.map.getHeightByRadius(p, this.radius)) {
      p = old;
    }
    if (player.getPosition().y + player.radius.y + this.radius.y < p.y) {
      p.y -= period * speed;
    } else if (player.getPosition().y - player.radius.y - this.radius.x > p.y) {
      p.y += period * speed;
    }
    if (gh !== this.map.getHeightByRadius(p, this.radius)) {
      p = old;
    }
    if (this.creatureCollision(p)) {
      p = old;
    }
    v = player.getPosition();
    if ((v.subtract(p).length() < this.attackRadius) && (v.z === p.z)) {
      a -= period;
      if (a <= 0) {
        a = 1 / attacks;
        this.notifyAction("OM NOM NOM");
        player.removeHealth(5);
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
  Zombie.spawn = function(map) {
    var x, y, z;
    z = new Zombie({
      health: 10,
      maxHealth: 10,
      id: RandomGUID()
    });
    x = parseInt(Math.random() * 600) + 200 + app.player.getPosition().x;
    y = parseInt(Math.random() * map.getHeight());
    z.setPosition(new Vector(x, (y + 0.5) * map.getGridHeight(), 0));
    z.show();
    Creatures.add(z);
    return z;
  };
  this.Zombie = Zombie;
}).call(this);
