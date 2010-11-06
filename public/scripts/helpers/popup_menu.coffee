
class PopupMenu
  constructor: (e) ->
    @e = e
    @el = $(".menu").hide()
    @ul = @el.css({ left : @e.clientX - 80, top : @e.clientY - 90 }).hide().find('ul').empty()

  setDescription: (text) ->
    @el.find(".description").text text
    
  setName: (text) ->
    @el.find(".name").text text

  # Description is floating text
  addMenuItem: (text, description, callback) ->
    $("<li />").text(text).attr({ title : description }).addClass('enabled').appendTo(@ul).click (e) =>
      @el.fadeOut()
      e.preventDefault()
      
      callback()

  # Description should say why the menu item is disabled
  addDisabledMenuItem: (text, description) ->
    $("<li />").text(text).attr({ title : description }).addClass('disabled').appendTo(@ul)
    
  show: ->
    @el.css({ left : @e.clientX - 80, top : @e.clientY - $(".menu").height() - 40 }).fadeIn()


this.PopupMenu = PopupMenu