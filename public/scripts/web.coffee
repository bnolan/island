

$(document).ready =>

  textarea = $("textarea[name*=code]")[0]
  
  if textarea
    editor = CodeMirror.fromTextArea(textarea.id, {
      height : "350px"
      width : "400px"
      parserfile : ["tokenizejavascript.js", "parsejavascript.js"]
      stylesheet : "/javascripts/codemirror/jscolors.css"
      path : "/javascripts/codemirror/"
      autoMatchParens : true
      saveFunction : =>
        $(textarea).parents("form").submit()
    })



  if $ITEM?
    if $("#item-viewer")
      playfield = new Playfield '#item-viewer'
    
      for x from 0 to 3
        for y from 0 to 3
          playfield.app.map.get(x,y).newTile Assets.get(11)
        
      playfield.setCenter(150,60)
    
      params = $ITEM
      params.x = 150
      params.y = 120
    
      item = new Item params
      item.show()
      window.item = item
      
      # name = "onShow"
      # 
      # setTimeout( =>
      #   item[name].call(item);
      # , 2000)
      