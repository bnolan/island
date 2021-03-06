(function() {
  var Application, FocusGrabber, Model, Playfield, WebSocketService;
  var __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  Math.clamp = function(v, min, max) {
    return Math.min(Math.max(min, v), max);
  };
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  Model = (function() {
    function Model() {
      Backbone.Model.apply(this, arguments);
      return this;
    }
    return Model;
  })();
  _.extend(Model.prototype, Backbone.Model.prototype);
  this.Model = Model;
  Playfield = (function() {
    function Playfield(parent) {
      this.container = $(parent).addClass('game-container');
      this.el = $("<div id='playfield' />").appendTo(this.container);
      window.app = new Application;
      this.app = window.app;
      return this;
    }
    return Playfield;
  })();
  Playfield.prototype.setCenter = function(x, y) {
    return this.el.css({
      left: 0 + this.container.width() / 2 - x,
      top: 0 + this.container.height() / 2 - y
    });
  };
  this.Playfield = Playfield;
  WebSocketService = (function() {
    function WebSocketService(app, socket) {
      this.socket = socket;
      this.app = app;
      this.hasConnection = false;
      return this;
    }
    return WebSocketService;
  })();
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
    return func ? func.call(this, data) : console.log("No handler for message type " + data.type);
  };
  WebSocketService.prototype.sendUpdate = function(model) {
    var obj;
    obj = model.getUpdateAttributes();
    obj.type = 'update';
    return this.socket.send(JSON.stringify(obj));
  };
  FocusGrabber = (function() {
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
      return this;
    }
    return FocusGrabber;
  })();
  this.RandomGUID = function() {
    return Math.random() * 0xFFFFFF;
  };
  Application = (function() {
    function Application() {
      var _this;
      _this = this;
      this.onclick = function() { return Application.prototype.onclick.apply(_this, arguments); };
      this.networkTick = function() { return Application.prototype.networkTick.apply(_this, arguments); };
      this.tick = function() { return Application.prototype.tick.apply(_this, arguments); };
      this.onSocketMessage = function() { return Application.prototype.onSocketMessage.apply(_this, arguments); };
      this.onSocketClose = function() { return Application.prototype.onSocketClose.apply(_this, arguments); };
      this.onSocketOpen = function() { return Application.prototype.onSocketOpen.apply(_this, arguments); };
      this.players = {};
      this.map = new Map;
      this.gridWidth = 100;
      this.gridHeight = 80;
      new FocusGrabber;
      if (typeof $ASSETS !== "undefined" && $ASSETS !== null) {
        Assets.refresh($ASSETS);
      }
      if (typeof $ITEMS !== "undefined" && $ITEMS !== null) {
        Items.refresh($ITEMS);
      }
      this.canvasWidth = this.map.getDimensions().x;
      this.canvasHeight = this.map.getDimensions().y;
      this.el = $("<div />").addClass('griddy').css({
        width: this.canvasWidth,
        height: this.canvasHeight
      }).appendTo('#playfield');
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
      return this;
    }
    return Application;
  })();
  Application.prototype.log = function(message) {
    return console.log(message);
  };
  Application.prototype.onSocketOpen = function(e) {};
  Application.prototype.onSocketClose = function() {
    return this.webSocketService.connectionClosed();
  };
  Application.prototype.onSocketMessage = function(e) {
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
    this.player = new Player($PLAYER);
    setInterval(this.tick, 33);
    setInterval(this.networkTick, 200);
    setInterval(this.creatureTick, 33);
    for (i = 1; i <= 2; i++) {
      Zombie.spawn(this.map);
    }
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
      Z: 90,
      X: 88,
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
      return (e.keyCode === $.keyCodes.LEFT) || (e.keyCode === $.keyCodes.RIGHT) || (e.keyCode === $.keyCodes.UP) || (e.keyCode === $.keyCodes.DOWN) || (e.keyCode === $.keyCodes.SPACE) ? e.preventDefault() : void 0;
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
    _ref = Creatures.models;
    _result = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      creature = _ref[_i];
      creature.redraw();
      _result.push(creature.tick(1 / 33));
    }
    return _result;
  };
  Application.prototype.networkTick = function() {
    return !this.player.dead ? this.webSocketService.sendUpdate(this.player) : void 0;
  };
  Application.prototype.onclick = function(e) {
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
    index = "" + x + "," + y;
    stack = this.map.get(x, y);
    asset = Assets.get($(".asset.selected").attr('data-id'));
    return stack.newTile(asset);
  };
  Application.prototype.draw = function() {
    w = this.canvasWidth;
    h = this.map.getDimensions().y;
    this.ctx.beginPath();
    for (y = 0, _to = h / this.gridHeight; y <= _to; y++) {
      this.ctx.moveTo(0, y * this.gridHeight);
      this.ctx.lineTo(w, y * this.gridHeight);
    }
    for (x = 0, _to2 = w / this.gridWidth; x <= _to2; x++) {
      this.ctx.moveTo(x * this.gridWidth, 0);
      this.ctx.lineTo(x * this.gridWidth, h);
    }
    this.ctx.strokeStyle = "#999";
    this.ctx.closePath();
    return this.ctx.stroke();
  };
  Application.prototype.playerDied = function(reason) {};
  this.Application = Application;
}).call(this);
