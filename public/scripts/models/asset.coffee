class Asset extends Model

    getImageUrl: ->
      @get('upload_url')
    
Assets = new Backbone.Collection
Assets.model = Asset

this.Asset = Asset
this.Assets = Assets