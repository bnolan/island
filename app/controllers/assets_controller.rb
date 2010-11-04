class AssetsController < ApplicationController
  before_filter :authenticate_user!
    
  def create
    params[:asset][:upload].each do |upload|
      Asset.create! :name => upload.original_filename.sub(/\.png/,''), :upload => upload, :description => "Uploaded #{Date.today.to_s}"
    end
    
    redirect_to assets_url
  end
  
  def show
    @asset = Asset.find params[:id]
  end
  
  def destroy
    @asset = Asset.find params[:id]
    @asset.destroy
    redirect_to assets_url
  end

  def update
    @asset = Asset.find params[:id]
    @asset.update_attributes! params[:asset]
    redirect_to @asset
  end

    
end
