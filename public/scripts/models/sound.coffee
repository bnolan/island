class Sound
  constructor: (filename) ->
    @el = $("<audio />").attr({src : filename}).appendTo('body')[0]
    
  play: ->
    @el.play()
  

class SoundManager
  constructor: ->
    @sounds = {}
    
  play: (name) ->
    filename = "/sounds/#{name}.wav"
    
    if not @sounds[name]
      @sounds[name] = new Sound filename
      
    @sounds[name].play()

this.Sounds = new SoundManager  
this.Sound = Sound