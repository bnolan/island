

$(document).ready =>

  textarea = $("textarea[name*=code]")[0]
  
  if textarea
    editor = CodeMirror.fromTextArea(textarea.id, {
      height : "350px"
      parserfile : ["tokenizejavascript.js", "parsejavascript.js"]
      stylesheet : "/javascripts/codemirror/jscolors.css"
      path : "/javascripts/codemirror/"
      autoMatchParens : true
      saveFunction : =>
        $(textarea).parents("form").submit()
    })

