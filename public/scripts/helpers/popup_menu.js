(function() {
  var PopupMenu;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  PopupMenu = function() {
    function PopupMenu(e) {
      this.e = e;
      this.el = $(".menu").hide();
      this.ul = this.el.css({
        left: this.e.clientX - 80,
        top: this.e.clientY - 90
      }).hide().find('ul').empty();
    }
    PopupMenu.prototype.setDescription = function(text) {
      return this.el.find(".description").text(text);
    };
    PopupMenu.prototype.setName = function(text) {
      return this.el.find(".name").text(text);
    };
    PopupMenu.prototype.addMenuItem = function(text, description, callback) {
      return $("<li />").text(text).attr({
        title: description
      }).addClass('enabled').appendTo(this.ul).click(__bind(function(e) {
        this.el.fadeOut();
        e.preventDefault();
        return callback();
      }, this));
    };
    PopupMenu.prototype.addDisabledMenuItem = function(text, description) {
      return $("<li />").text(text).attr({
        title: description
      }).addClass('disabled').appendTo(this.ul);
    };
    PopupMenu.prototype.show = function() {
      return this.el.css({
        left: this.e.clientX - 80,
        top: this.e.clientY - $(".menu").height() - 40
      }).fadeIn();
    };
    return PopupMenu;
  }();
  this.PopupMenu = PopupMenu;
}).call(this);
