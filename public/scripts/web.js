(function() {
  var __bind = function(func, context) {
    return function() { return func.apply(context, arguments); };
  };
  $(document).ready(__bind(function() {
    var editor, textarea;
    textarea = $("textarea[name*=code]")[0];
    return textarea ? editor = CodeMirror.fromTextArea(textarea.id, {
      height: "350px",
      parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
      stylesheet: "/javascripts/codemirror/jscolors.css",
      path: "/javascripts/codemirror/",
      autoMatchParens: true,
      saveFunction: __bind(function() {
        return $(textarea).parents("form").submit();
      }, this)
    }) : void 0;
  }, this));
}).call(this);
