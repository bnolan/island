(function() {
  var Application, FocusGrabber, Model, Playfield, WebSocketService;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Math.clamp = function(v, min, max) {
    return Math.min(Math.max(min, v), max);
  };
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  Model = function() {
    function Model() {
      Backbone.Model.apply(this, arguments);
    }
    return Model;
  }();
  _.extend(Model.prototype, Backbone.Model.prototype);
  this.Model = Model;
  Playfield = function() {
    function Playfield(parent) {
      this.container = $(parent).addClass('game-container');
      this.el = $("<div id='playfield' />").appendTo(this.container);
      window.app = new Application;
      this.app = window.app;
    }
    Playfield.prototype.setCenter = function(x, y) {
      return this.el.css({
        left: 0 + this.container.width() / 2 - x,
        top: 0 + this.container.height() / 2 - y
      });
    };
    return Playfield;
  }();
  this.Playfield = Playfield;
  WebSocketService = function() {
    function WebSocketService(app, socket) {
      this.socket = socket;
      this.app = app;
      this.hasConnection = false;
    }
    WebSocketService.prototype.welcomeHandler = function(data) {};
    WebSocketService.prototype.connectionClosed = function() {
      this.hasConnection = false;
      return console.log('Connection closed');
    };
    WebSocketService.prototype.updateHandler = function(data) {
      var player;
      player = this.app.players[2];
      player.position.x = data.position[0];
      player.position.y = data.position[1];
      player.position.z = data.position[2];
      return player.draw(200);
    };
    WebSocketService.prototype.processMessage = function(data) {
      var func;
      func = this[data.type + 'Handler'];
      if (func) {
        return func.call(this, data);
      } else {
        return console.log("No handler for message type " + data.type);
      }
    };
    WebSocketService.prototype.sendUpdate = function(model) {
      var obj;
      obj = model.getUpdateAttributes();
      obj.type = 'update';
      return this.socket.send(JSON.stringify(obj));
    };
    return WebSocketService;
  }();
  FocusGrabber = function() {
    function FocusGrabber() {
      this.input = $("<input type='text' />").css({
        opacity: 0.01,
        position: 'absolute',
        left: -100,
        top: -100
      });
      this.input.appendTo('body');
      setTimeout(__bind(function() {
        return this.input.focus();
      }, this), 100);
    }
    return FocusGrabber;
  }();
  Application = function() {
    function Application() {
      this.onclick = __bind(this.onclick, this);;
      this.networkTick = __bind(this.networkTick, this);;
      this.tick = __bind(this.tick, this);;
      this.onSocketMessage = __bind(this.onSocketMessage, this);;
      this.onSocketClose = __bind(this.onSocketClose, this);;
      this.onSocketOpen = __bind(this.onSocketOpen, this);;
      this.gridWidth = 100;
      this.gridHeight = 80;
      new FocusGrabber;
      if (typeof $ASSETS != "undefined" && $ASSETS !== null) {
        Assets.refresh($ASSETS);
      }
      if (typeof $ITEMS != "undefined" && $ITEMS !== null) {
        Items.refresh($ITEMS);
      }
      this.canvasWidth = $(document).width();
      this.canvasHeight = $(document).height();
      this.el = $("<canvas />").attr('width', this.canvasWidth).attr('height', this.canvasHeight).appendTo('#playfield');
      this.ctx = this.el[0].getContext('2d');
      this.players = {};
      this.map = new Map;
      this.draw();
      this.webSocket = new WebSocket("ws://localhost:8180");
      this.webSocket.onopen = this.onSocketOpen;
      this.webSocket.onclose = this.onSocketClose;
      this.webSocket.onmessage = this.onSocketMessage;
      this.webSocketService = new WebSocketService(this, this.webSocket);
      this.map.autogenerate();
      $("#playfield").click(this.onclick);
      $("#playfield").css({
        top: ($('#playfield-container').height() - this.map.getDimensions().y) / 2
      });
      $(".toolbox .asset").click(function(e) {
        $(".toolbox .asset").removeClass('selected');
        $(e.currentTarget).addClass('selected');
        return e.preventDefault();
      });
    }
    Application.prototype.log = function(message) {
      return console.log(message);
    };
    Application.prototype.onSocketOpen = function(e) {};
    Application.prototype.onSocketClose = function() {
      return this.webSocketService.connectionClosed();
    };
    Application.prototype.onSocketMessage = function(e) {
      var data;
      data = null;
      try {
        data = JSON.parse(e.data);
      } catch (err) {
        console.log("Unable to parse message");
        console.log(e.data);
        return;
      }
      return this.webSocketService.processMessage(data);
    };
    Application.prototype.addPlayer = function() {
      var p, player, _i, _len, _ref;
      Zombie.spawn(this.map);
      this.player = new Player($PLAYER);
      setInterval(this.tick, 33);
      setInterval(this.networkTick, 200);
      setInterval(this.creatureTick, 100);
      _ref = $PLAYERS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.id !== this.player.id) {
          p = new Player(player);
          p.hide();
          this.players[player.id] = p;
        }
      }
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
        $.keys[e.keyCode] = true;
        if ((e.keyCode === $.keyCodes.LEFT) || (e.keyCode === $.keyCodes.RIGHT) || (e.keyCode === $.keyCodes.UP) || (e.keyCode === $.keyCodes.DOWN) || (e.keyCode === $.keyCodes.SPACE)) {
          return e.preventDefault();
        }
      }, this));
      return $(document).keyup(__bind(function(e) {
        return $.keys[e.keyCode] = false;
      }, this));
    };
    Application.prototype.tick = function() {
      this.player.draw();
      return this.player.tick();
    };
    Application.prototype.creatureTick = function() {
      var creature, _i, _len, _ref, _results;
      _ref = Creatures.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        creature = _ref[_i];
        creature.redraw();
        _results.push(creature.tick(1 / 10));
      }
      return _results;
    };
    Application.prototype.networkTick = function() {
      if (!this.player.dead) {
        return this.webSocketService.sendUpdate(this.player);
      }
    };
    Application.prototype.onclick = function(e) {
      var x, y;
      $(".menu:visible").fadeOut();
      if ($(".asset.selected").length > 0) {
        x = e.clientX - this.el.offset().left;
        y = e.clientY - this.el.offset().top;
        x = Math.floor(x / this.gridWidth);
        y = Math.floor(y / this.gridHeight);
        return this.addTile(x, y);
      }
    };
    Application.prototype.addTile = function(x, y) {
      var asset, index, stack;
      index = "" + x + "," + y;
      stack = this.map.get(x, y);
      asset = Assets.get($(".asset.selected").attr('data-id'));
      return stack.newTile(asset);
    };
    Application.prototype.draw = function() {
      var h, w, x, y, _to, _to2;
      w = this.canvasWidth;
      h = this.map.getDimensions().y;
      this.ctx.beginPath();
      for (y = 0, _to = h / this.gridHeight; 0 <= _to ? y <= _to : y >= _to; 0 <= _to ? y++ : y--) {
        this.ctx.moveTo(0, y * this.gridHeight);
        this.ctx.lineTo(w, y * this.gridHeight);
      }
      for (x = 0, _to2 = w / this.gridWidth; 0 <= _to2 ? x <= _to2 : x >= _to2; 0 <= _to2 ? x++ : x--) {
        this.ctx.moveTo(x * this.gridWidth, 0);
        this.ctx.lineTo(x * this.gridWidth, h);
      }
      this.ctx.strokeStyle = "#999";
      this.ctx.closePath();
      return this.ctx.stroke();
    };
    Application.prototype.playerDied = function(reason) {};
    return Application;
  }();
  this.Application = Application;
}).call(this);
