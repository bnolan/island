(function() {
  var Sound, SoundManager;
  Sound = (function() {
    function Sound(filename) {
      this.el = $("<audio />").attr({
        src: filename
      }).appendTo('body')[0];
      return this;
    }
    return Sound;
  })();
  Sound.prototype.play = function() {
    return this.el.play();
  };
  SoundManager = (function() {
    function SoundManager() {
      this.sounds = {};
      return this;
    }
    return SoundManager;
  })();
  SoundManager.prototype.play = function(name) {
    var filename;
    filename = "/sounds/" + name + ".wav";
    if (!this.sounds[name]) {
      this.sounds[name] = new Sound(filename);
    }
    return this.sounds[name].play();
  };
  this.Sounds = new SoundManager;
  this.Sound = Sound;
}).call(this);
