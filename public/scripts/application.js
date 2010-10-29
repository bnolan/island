(function() {
  var Application, Asset, Assets, Model, Player, Stack, Tile, Vector;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Math.clamp = function(v, min, max) {
    return Math.min(Math.max(min, v), max);
  };
  Model = (function() {
    function Model() {
      Backbone.Model.apply(this, arguments);
      return this;
    }
    return Model;
  })();
  _.extend(Model.prototype, Backbone.Model.prototype);
  Asset = (function() {
    function Asset() {
      return Model.apply(this, arguments);
    }
    return Asset;
  })();
  __extends(Asset, Model);
  Asset.prototype.getImageUrl = function() {
    return this.get('upload_url');
  };
  Assets = new Backbone.Collection;
  Assets.model = Asset;
  Tile = (function() {
    function Tile(stack, asset) {
      this.stack = stack;
      this.asset = asset;
      this.gridWidth = 100;
      this.gridHeight = 80;
      this.div = $("<div />").addClass('tile');
      $("<img />").attr('src', this.asset.getImageUrl()).appendTo(this.div);
      return this;
    }
    return Tile;
  })();
  Tile.prototype.draw = function() {
    var _i, _len, _ref, _result, height, stack, x, y;
    x = this.stack.x;
    y = this.stack.y;
    height = this.stack.stackingHeight();
    this.div.css({
      position: 'absolute',
      left: x * this.gridWidth,
      top: y * this.gridHeight - this.div.height() - 50 - height,
      'z-index': y * this.gridHeight + height
    });
    $("<label>" + x + "," + y + "," + height + "</label>").appendTo(this.div);
    if (this.div.parent().length === 0) {
      this.div.appendTo('#playfield');
    }
    this.redrawShadows();
    _ref = this.stack.getNeighbours();
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stack = _ref[_i];
      _result.push(stack.getTop().redrawShadows());
    }
    return _result;
  };
  Tile.prototype.redrawShadows = function() {
    if (this.drawShadow()) {
      this.div.find('.shadow').remove();
      if (this.stack.westernNeighbour() && (this.stack.westernNeighbour().stackingHeight() > this.stack.stackingHeight())) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo(this.div);
      }
      if (this.stack.easternNeighbour() && (this.stack.easternNeighbour().stackingHeight() > this.stack.stackingHeight())) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo(this.div);
      }
      if (this.stack.northernNeighbour() && (this.stack.northernNeighbour().stackingHeight() < this.stack.stackingHeight())) {
        $("<img />").addClass('shadow').attr('src', '/images/shadows/south.png?4').css({
          top: -40
        }).appendTo(this.div);
      }
      return this.stack.northernNeighbour() && (this.stack.northernNeighbour().stackingHeight() > this.stack.stackingHeight()) ? $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo(this.div) : void 0;
    }
  };
  Tile.prototype.getHeight = function(x, y) {
    return this.isRamp() ? (this.asset.get('height_east') - this.asset.get('height_west')) * x + this.asset.get('height_west') : 40;
  };
  Tile.prototype.isRamp = function() {
    return this.asset.get('name').match(/ramp/i);
  };
  Tile.prototype.isDeadly = function() {
    return this.isLava() || this.isWater();
  };
  Tile.prototype.isLava = function() {
    return this.asset.get('name').match(/lava/i);
  };
  Tile.prototype.isWater = function() {
    return this.asset.get('name').match(/water/i);
  };
  Tile.prototype.drawShadow = function() {
    if (this.isRamp()) {
      return false;
    }
    return true;
  };
  Stack = (function() {
    function Stack(map, x, y) {
      this.map = map;
      this.tiles = [];
      this.x = x;
      this.y = y;
      return this;
    }
    return Stack;
  })();
  Stack.prototype.height = function(x, y) {
    x = (x - this.x * 100) / 100;
    y = (y - this.y * 100) / 100;
    return (this.tiles.length - 1) * 40 + this.getTop().getHeight(x, y);
  };
  Stack.prototype.stackingHeight = function() {
    return this.tiles.length * 40;
  };
  Stack.prototype.push = function(tile) {
    this.tiles.push(tile);
    return tile.draw();
  };
  Stack.prototype.newTile = function(asset) {
    var tile;
    tile = new Tile(this, asset);
    return this.push(tile);
  };
  Stack.prototype.getTop = function() {
    return this.tiles[this.tiles.length - 1];
  };
  Stack.prototype.pop = function(tile) {
    return this.tiles.pop();
  };
  Stack.prototype.westernNeighbour = function() {
    return this.getNeighbour(this.x - 1, this.y);
  };
  Stack.prototype.easternNeighbour = function() {
    return this.getNeighbour(this.x + 1, this.y);
  };
  Stack.prototype.northernNeighbour = function() {
    return this.getNeighbour(this.x, this.y - 1);
  };
  Stack.prototype.southernNeighbour = function() {
    return this.getNeighbour(this.x, this.y + 1);
  };
  Stack.prototype.getNeighbour = function(x, y) {
    return this.map["" + x + "," + y];
  };
  Stack.prototype.getNeighbours = function() {
    return _.compact([this.getNeighbour(this.x - 1, y), this.getNeighbour(this.x, y - 1), this.getNeighbour(this.x, y + 1), this.getNeighbour(this.x + 1, y)]);
  };
  Stack.prototype.save = function() {
    var _i, _len, _ref, _result, tile;
    _ref = this.tiles;
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tile = _ref[_i];
      _result.push(tile.save());
    }
    return _result;
  };
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
  Player = (function() {
    function Player() {
      this.div = $("<div />").addClass('player');
      this.avatar = $("<img />").attr('src', '/system/uploads/34/original/boy.png?1288307760').addClass('avatar').appendTo(this.div);
      this.shadow = $("<img />").attr('src', '/system/uploads/35/original/shadow.png?1288308096').addClass('shadow').appendTo(this.div);
      this.velocity = new Vector(0, 0, 0);
      this.position = new Vector(150, 120, 50);
      this.radius = new Vector(10, 4, 0);
      this.draw();
      this.dead = false;
      return this;
    }
    return Player;
  })();
  Player.prototype.deathBy = function(sender) {
    this.dead = true;
    return app.playerDied("FROM STANDING ON THE DEADLY " + (sender.asset.get('name')));
  };
  Player.prototype.tick = function() {
    var oldPosition, tile, vacc, vdamp, vmax;
    if (this.dead) {
      return;
    }
    oldPosition = this.position;
    this.position = this.position.add(this.velocity);
    tile = this.getTile();
    if (tile) {
      if (tile.isDeadly() && this.groundContact()) {
        this.deathBy(tile);
      }
    }
    if (this.position.y <= 0 + this.radius.y) {
      this.position.y = 0 + this.radius.y;
      this.velocity.y = 0;
    }
    if (this.position.x <= 0 + this.radius.x) {
      this.position.x = 0 + this.radius.x;
      this.velocity.x = 0;
    }
    if (this.position.y >= 1000 - this.radius.y) {
      this.position.y = 1000 - this.radius.y;
      this.velocity.y = 0;
    }
    if (this.groundContact()) {
      this.velocity.z = 0;
      this.position.z = this.groundHeight();
    } else {
      this.velocity.z -= 1;
    }
    vacc = 1.5;
    vdamp = 0.8;
    vmax = 6;
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
      if ($.keys[$.keyCodes.SPACE]) {
        this.velocity.z = 10;
        this.position.z += 1;
      }
    }
    this.velocity.x = Math.clamp(this.velocity.x, -vmax, vmax);
    this.velocity.y = Math.clamp(this.velocity.y, -vmax, vmax);
    return this.velocity.z = Math.clamp(this.velocity.z, -20, 20);
  };
  Player.prototype.groundContact = function() {
    return this.position.z <= this.groundHeight();
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
    var index, x, y;
    x = Math.floor(this.position.x / 100);
    y = Math.floor(this.position.y / 80);
    index = "" + x + "," + y;
    return (typeof app !== "undefined" && app !== null) && app.map[index];
  };
  Player.prototype.groundHeight = function() {
    return this.getStack() ? this.getStack().height(this.position.x, this.position.y) : 0;
  };
  Application = (function() {
    function Application() {
      var _this;
      _this = this;
      this.onclick = function() { return Application.prototype.onclick.apply(_this, arguments); };
      this.tick = function() { return Application.prototype.tick.apply(_this, arguments); };
      this.map = {};
      this.gridWidth = 100;
      this.gridHeight = 80;
      this.canvasWidth = $(document).width();
      this.canvasHeight = $(document).height();
      this.el = $("<canvas />").attr('width', this.canvasWidth).attr('height', this.canvasHeight).appendTo('#playfield');
      this.ctx = this.el[0].getContext('2d');
      this.draw();
      this.player = new Player;
      setInterval(this.tick, 33);
      $.keys = {};
      $.keyCodes = {
        ALT: 18,
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        COMMAND: 91,
        COMMAND_LEFT: 91,
        COMMAND_RIGHT: 93,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        MENU: 93,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        WINDOWS: 91
      };
      $(document).keydown(__bind(function(e) {
        return $.keys[e.keyCode] = true;
      }, this));
      $(document).keyup(__bind(function(e) {
        return $.keys[e.keyCode] = false;
      }, this));
      $("#playfield").click(this.onclick);
      $("img").click(function(e) {
        $("img").removeClass('selected');
        $(e.currentTarget).addClass('selected');
        return e.preventDefault();
      });
      return this;
    }
    return Application;
  })();
  Application.prototype.tick = function() {
    this.player.draw();
    return this.player.tick();
  };
  Application.prototype.onclick = function(e) {
    x = e.clientX - this.el.offset().left;
    y = e.clientY - this.el.offset().top;
    x = Math.floor(x / this.gridWidth);
    y = Math.floor(y / this.gridHeight);
    return this.addTile(x, y);
  };
  Application.prototype.addTile = function(x, y) {
    index = "" + x + "," + y;
    stack = this.map[index] ? this.map[index] : this.map[index] = new Stack(this.map, x, y);
    asset = Assets.get($("img.selected").attr('data-id'));
    return stack.newTile(asset);
  };
  Application.prototype.draw = function() {
    w = this.canvasWidth;
    h = this.canvasHeight;
    this.ctx.beginPath();
    for (y = 0, _to = h / this.gridHeight; y <= _to; y++) {
      this.ctx.moveTo(0, y * this.gridHeight);
      this.ctx.lineTo(w, y * this.gridHeight);
    }
    for (x = 0, _to2 = w / this.gridWidth; x <= _to2; x++) {
      this.ctx.moveTo(x * this.gridWidth, 0);
      this.ctx.lineTo(x * this.gridWidth, h);
    }
    this.ctx.closePath();
    return this.ctx.stroke();
  };
  Application.prototype.playerDied = function(reason) {
    alert("YOU HAVE DIED " + reason);
    return $("#playfield").fadeOut();
  };
  $(document).ready(__bind(function() {
    Assets.refresh($ASSETS);
    this.Assets = Assets;
    return this.app = new Application;
  }, this));
}).call(this);
