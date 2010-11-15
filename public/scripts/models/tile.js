(function() {
  var Tile;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Tile = function() {
    function Tile(stack, asset) {
      this.onclick = __bind(this.onclick, this);;
      this.stack = stack;
      this.asset = asset;
      this.gridWidth = 100;
      this.gridHeight = 80;
      this.div = $("<div />").addClass('tile');
      if (this.asset) {
        this.img = $("<img />").attr('src', this.asset.getImageUrl()).appendTo(this.div);
        this.div.click(this.onclick);
      } else {
        this.div.css({
          height: 170,
          width: 100
        });
      }
    }
    Tile.prototype._draw = function() {
      var divheight, height, x, y;
      x = this.stack.x;
      y = this.stack.y;
      height = this.stack.stackingHeight();
      divheight = this.div.height();
      divheight = 0;
      this.div.css({
        position: 'absolute',
        left: x * this.gridWidth,
        top: y * this.gridHeight - divheight - 10 - height,
        'z-index': y * this.gridHeight + height
      });
      if (this.div.parent().length === 0) {
        return this.div.appendTo('#playfield');
      }
    };
    Tile.prototype.draw = function() {
      var stack, _i, _len, _ref, _results;
      this._draw();
      this.redrawShadows();
      _ref = this.stack.getNeighbours();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        _results.push(stack.redrawShadows());
      }
      return _results;
    };
    Tile.prototype.remove = function() {
      this.stack.pop();
      return this.div.remove();
    };
    Tile.prototype.redrawShadows = function() {
      this._draw();
      this.div.find('.shadow').remove();
      if (this.drawShadow()) {
        if (this.stack.westernNeighbour().stackingHeight() > this.stack.stackingHeight()) {
          $("<img />").addClass('shadow').attr('src', '/images/shadows/west.png').appendTo(this.div);
        }
        if (this.stack.easternNeighbour().stackingHeight() > this.stack.stackingHeight()) {
          $("<img />").addClass('shadow').attr('src', '/images/shadows/east.png').appendTo(this.div);
        }
        if (this.stack.northernNeighbour().stackingHeight() > this.stack.stackingHeight()) {
          return $("<img />").addClass('shadow').attr('src', '/images/shadows/north.png').appendTo(this.div);
        }
      }
    };
    Tile.prototype.getHeight = function(x, y) {
      if (!this.asset) {
        return 0;
      } else if (this.isRamp()) {
        return (this.asset.get('height_east') - this.asset.get('height_west')) * x + this.asset.get('height_west');
      } else {
        return 40;
      }
    };
    Tile.prototype.getName = function() {
      return this.asset.get('name');
    };
    Tile.prototype.getDescription = function() {
      return "";
    };
    Tile.prototype.verbs = function() {
      return [];
    };
    Tile.prototype.onclick = function(e) {
      var menu, player, _fn, _i, _len, _ref;
      console.log(e.button);
      player = app.player;
      menu = new PopupMenu(e);
      menu.setName(this.getName());
      menu.setDescription(this.getDescription());
      _ref = this.verbs();
      _fn = function(verb) {
        var func;
        func = this[verb.getCallbackName()];
        if (player.canPerform(verb)) {
          return menu.addMenuItem(verb.getName(), verb.getDescription(), __bind(function() {
            return func.call(this, player);
          }, this));
        } else {
          return menu.addDisabledMenuItem(verb.getName(), verb.getRequirements());
        }
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        verb = _ref[_i];
        _fn.call(this, verb);
      }
      menu.show();
      e.preventDefault();
      return e.stopPropagation();
    };
    Tile.prototype.onDestroy = function() {
      return this.remove();
    };
    Tile.prototype.isRamp = function() {
      if (this.asset) {
        return this.asset.get('name').match(/ramp/i);
      } else {
        return false;
      }
    };
    Tile.prototype.isDeadly = function() {
      if (this.asset) {
        return this.isLava() || this.isWater();
      } else {
        return false;
      }
    };
    Tile.prototype.isLava = function() {
      if (this.asset) {
        return this.asset.get('name').match(/lava/i);
      } else {
        return false;
      }
    };
    Tile.prototype.isWater = function() {
      if (this.asset) {
        return this.asset.get('name').match(/water/i);
      } else {
        return false;
      }
    };
    Tile.prototype.drawShadow = function() {
      if (this.isRamp()) {
        return false;
      }
      return true;
    };
    Tile.prototype.toJSON = function() {
      return {
        asset_id: this.asset.id
      };
    };
    return Tile;
  }();
  this.Tile = Tile;
}).call(this);
