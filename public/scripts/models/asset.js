(function() {
  var Asset, Assets;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key];
    child.__super__ = parent.prototype;
    return child;
  };
  Asset = function() {
    function Asset() {
      Asset.__super__.constructor.apply(this, arguments);
    }
    __extends(Asset, Model);
    Asset.prototype.getImageUrl = function() {
      return this.get('upload_url');
    };
    return Asset;
  }();
  Assets = new Backbone.Collection;
  Assets.model = Asset;
  this.Asset = Asset;
  this.Assets = Assets;
}).call(this);
