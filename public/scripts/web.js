(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(document).ready(__bind(function() {
    var editor, item, params, playfield, textarea, x, y;
    textarea = $("textarea[name*=code]")[0];
    if (textarea) {
      editor = CodeMirror.fromTextArea(textarea.id, {
        height: "350px",
        width: "400px",
        parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
        stylesheet: "/javascripts/codemirror/jscolors.css",
        path: "/javascripts/codemirror/",
        autoMatchParens: true,
        saveFunction: __bind(function() {
          return $(textarea).parents("form").submit();
        }, this)
      });
    }
    if (typeof $ITEM != "undefined" && $ITEM !== null) {
      if ($("#item-viewer")) {
        playfield = new Playfield('#item-viewer');
        for (x = 0; x <= 3; x++) {
          for (y = 0; y <= 3; y++) {
            playfield.app.map.get(x, y).newTile(Assets.get(11));
          }
        }
        playfield.setCenter(150, 60);
        params = $ITEM;
        params.x = 150;
        params.y = 120;
        item = new Item(params);
        item.show();
        return window.item = item;
      }
    }
  }, this));
}).call(this);
