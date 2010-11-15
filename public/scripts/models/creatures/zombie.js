(function() {
  var Zombie;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
    child.__super__ = parent.prototype;
    return child;
  };
  Zombie = function() {
    function Zombie() {
      this.onVerbBash = __bind(this.onVerbBash, this);;
      Zombie.__super__.constructor.apply(this, arguments);
    }
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
      var a, attacks, b, gh, old, p, player, speed, v;
      this.radius = new Vector(25, 25, 0);
      this.attackRadius = 80;
      speed = 25;
      attacks = 0.2;
      old = this.getPosition();
      p = this.getPosition();
      gh = this.getGroundHeight(p);
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
      if (gh !== this.getGroundHeight(p)) {
        p = old;
      }
      v = player.getPosition();
      if (v.subtract(p).length() < this.attackRadius) {
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
    return Zombie;
  }();
  Zombie.spawn = function(map) {
    var stack, x, y, z;
    z = new Zombie({
      health: 10,
      maxHealth: 10
    });
    stack = new Stack;
    while (stack.isEmpty()) {
      x = parseInt(Math.random() * 10) + 6;
      y = parseInt(Math.random() * map.getHeight());
      stack = map.get(x, y);
    }
    z.setPosition(new Vector((x + 0.5) * map.getGridWidth(), (y + 0.5) * map.getGridHeight(), 0));
    z.show();
    Creatures.add(z);
    return z;
  };
  this.Zombie = Zombie;
}).call(this);
