(function() {
  var Application, Model;
  var __bind = function(func, context) {
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
  this.Model = Model;
  Application = (function() {
    function Application() {
      var _this;
      _this = this;
      this.onclick = function() { return Application.prototype.onclick.apply(_this, arguments); };
      this.tick = function() { return Application.prototype.tick.apply(_this, arguments); };
      this.gridWidth = 100;
      this.gridHeight = 80;
      Assets.refresh($ASSETS);
      this.canvasWidth = $(document).width();
      this.canvasHeight = $(document).height();
      this.el = $("<canvas />").attr('width', this.canvasWidth).attr('height', this.canvasHeight).appendTo('#playfield');
      this.ctx = this.el[0].getContext('2d');
      this.draw();
      this.map = new Map;
      this.map.refresh($MAP);
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
      $("#playfield").draggable({
        axis: 'x'
      });
      $("#playfield").click(this.onclick);
      $(".toolbox .asset").click(function(e) {
        $(".toolbox .asset").removeClass('selected');
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
    stack = this.map.get(x, y);
    asset = Assets.get($(".asset.selected").attr('data-id'));
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
    this.ctx.strokeStyle = "#999";
    this.ctx.closePath();
    return this.ctx.stroke();
  };
  Application.prototype.playerDied = function(reason) {};
  this.Application = Application;
}).call(this);
