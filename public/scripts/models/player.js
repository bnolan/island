(function() {
  var Player;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Player = (function() {
    function Player() {
      Player.__super__.constructor.apply(this, arguments);
      this.div = $("<div />").addClass('player');
      this.avatar = $("<img />").attr('src', '/system/uploads/34/original/boy.png?1288307760').addClass('avatar').appendTo(this.div);
      this.shadow = $("<img />").attr('src', '/images/shadows/player.png').addClass('shadow').appendTo(this.div);
      this.velocity = new Vector(0, 0, 0);
      this.position = new Vector(this.get('x'), this.get('y'), this.get('z'));
      this.radius = new Vector(30, 10, 0);
      this.jumpTimer = 10;
      this.draw();
      this.dead = false;
      this.health = 10;
      this.maxHealth = 15;
      this.healthBar = $("#health");
      this.animateHealth();
      return this;
    }
    return Player;
  })();
  __extends(Player, Model);
  Player.prototype.notifyAction = function(text) {
    var label, y;
    y = parseInt(this.avatar.css('top')) + 60;
    label = $("<label />").text(text).addClass('action');
    label.appendTo(this.div);
    return label.css({
      top: y
    }).animate({
      top: y - 15
    }, 500, 'linear').animate({
      top: y - 30,
      opacity: 0
    }, 500, 'linear', __bind(function() {
      return label.remove();
    }, this));
  };
  Player.prototype.addHealth = function(x, sender) {
    this.health = Math.min(this.health + x, this.maxHealth);
    return this.animateHealth();
  };
  Player.prototype.removeHealth = function(x, sender) {
    this.health = Math.max(this.health - x, 0);
    this.animateHealth();
    return this.health === 0 ? this.deathBy(sender) : void 0;
  };
  Player.prototype.animateHealth = function() {
    var percentage;
    percentage = 100 / this.maxHealth * this.health;
    this.healthBar.find('span').stop().animate({
      width: "" + percentage + "%"
    }, 1000);
    return this.healthBar.find('label').text(this.health);
  };
  Player.prototype.dropItem = function(item) {
    item.set({
      x: this.position.x + this.radius.x,
      y: this.position.y + 5
    });
    return item.show();
  };
  Player.prototype.say = function(message) {
    return $("<div />").addClass("speech").html("<label>" + message + "</label>").appendTo(this.div);
  };
  Player.prototype.deathBy = function(sender) {
    this.dead = true;
    this.say("FUUUU!!");
    if (sender instanceof Tile) {
      if (sender.isWater()) {
        this.div.addClass('drowned');
        app.playerDied("from falling in the water. You must have forgotten your mom never taught you to swim.");
      }
      if (sender.isLava()) {
        this.div.addClass('drowned');
        app.playerDied("from trying to swim in the deadly molten lava.");
      }
    }
    if (sender === "falling") {
      this.div.animate({
        opacity: 0,
        'margin-top': 500
      }, 1000, 'linear');
      return app.playerDied("from falling to the unknown regions far far below.");
    }
  };
  Player.prototype.tick = function() {
    var groundHeight, margin, oldPosition, playfieldWidth, stepHeight, tile, vacc, vdamp, vmax;
    if (this.dead) {
      return;
    }
    oldPosition = this.position;
    this.position = this.position.add(this.velocity);
    if (this.position.y <= 0 + this.radius.y) {
      this.position = oldPosition;
      this.velocity.y = 0;
    }
    if (this.position.x <= 0 + this.radius.x) {
      this.position = oldPosition;
      this.velocity.x = 0;
    }
    if (this.position.y >= 800 - this.radius.y) {
      this.position = oldPosition;
      this.velocity.y = 0;
    }
    margin = 100;
    playfieldWidth = $('#playfield-container').width();
    if (this.position.x + parseInt($("#playfield").css('left')) > playfieldWidth - margin) {
      $("#playfield").stop().animate({
        left: -this.position.x + margin * 2
      });
    }
    if (this.position.x + parseInt($("#playfield").css('left')) < margin) {
      $("#playfield").stop().animate({
        left: playfieldWidth - margin * 2 - this.position.x
      });
    }
    tile = this.getTile();
    stepHeight = 15;
    groundHeight = app.map.getHeightByRadius(this.position, this.radius);
    if (tile && (tile.isRamp())) {
      groundHeight = app.map.getHeightByPoint(this.position);
    }
    if (groundHeight > this.position.z + stepHeight) {
      this.position = oldPosition;
      this.velocity = new Vector;
    } else if (groundHeight >= this.position.z) {
      this.position.z = groundHeight;
      this.velocity.z = 0;
    } else {
      this.velocity.z -= 1;
    }
    if (this.position.z < 0) {
      this.deathBy('falling');
    }
    if (tile) {
      if (tile.isDeadly() && this.groundContact()) {
        this.deathBy(tile);
      }
    }
    vacc = 1.5;
    vdamp = 0.8;
    vmax = 6;
    this.jumpTimer--;
    if (this.groundContact()) {
      if ($.keys[$.keyCodes.LEFT]) {
        this.velocity.x -= vacc;
      } else if ($.keys[$.keyCodes.RIGHT]) {
        this.velocity.x += vacc;
      } else {
        this.velocity.x *= vdamp;
      }
      if ($.keys[$.keyCodes.UP]) {
        this.velocity.y -= vacc;
      } else if ($.keys[$.keyCodes.DOWN]) {
        this.velocity.y += vacc;
      } else {
        this.velocity.y *= vdamp;
      }
      if ($.keys[$.keyCodes.SPACE] && this.jumpTimer <= 0) {
        this.jumpTimer = 15;
        this.velocity.z = 10;
        this.position.z += 1;
        this.avatar.css({
          height: 150,
          width: 100,
          'padding-top': 20
        }).animate({
          height: 170,
          width: 100,
          'padding-top': 0
        });
      }
    }
    this.velocity.x = Math.clamp(this.velocity.x, -vmax, vmax);
    this.velocity.y = Math.clamp(this.velocity.y, -vmax, vmax);
    return this.velocity.z = Math.clamp(this.velocity.z, -20, 20);
  };
  Player.prototype.groundContact = function() {
    return this.position.z <= app.map.getHeightByRadius(this.position, this.radius) + 5;
  };
  Player.prototype.altitude = function() {
    return this.position.z;
  };
  Player.prototype.draw = function() {
    var altitude, height;
    if (this.div.parent().length === 0) {
      this.div.appendTo('#playfield').hide().fadeIn();
    }
    height = 120;
    altitude = this.altitude();
    this.div.css({
      top: this.position.y,
      left: this.position.x,
      'z-index': parseInt(this.position.y + altitude) + 10
    });
    this.avatar.css({
      top: 0 - altitude - height - 15,
      left: -50
    });
    return this.shadow.css({
      top: 0 - this.groundHeight() - 20,
      left: -25
    });
  };
  Player.prototype.getTile = function() {
    return this.getStack() && this.getStack().getTop();
  };
  Player.prototype.getStack = function() {
    var x, y;
    x = Math.floor(this.position.x / 100);
    y = Math.floor(this.position.y / 80);
    return (typeof app !== "undefined" && app !== null) && app.map.get(x, y);
  };
  Player.prototype.groundHeight = function() {
    return this.getStack() ? this.getStack().height(this.position.x, this.position.y) : 0;
  };
  Player.prototype.getUpdateAttributes = function() {
    return {
      position: this.position.toWire(),
      velocity: this.position.toWire(),
      id: this.id
    };
  };
  this.Player = Player;
}).call(this);
