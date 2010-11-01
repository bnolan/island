(function() {
  var Asset, Assets;
  var __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  };
  Asset = (function() {
    function Asset() {
      return Model.apply(this, arguments);
    }
    return Asset;
  })();
  __extends(Asset, Model);
  Asset.prototype.getImageUrl = function() {
    return this.get('upload_url');
  };
  Assets = new Backbone.Collection;
  Assets.model = Asset;
  this.Asset = Asset;
  this.Assets = Assets;
}).call(this);
