class ItemsController < ApplicationController
  
  def create
    @item = Item.create! params[:item]
    redirect_to @item
  end
  
  def show
    @item = Item.find params[:id]
  end
  
  def update
    @item = Item.find params[:id]
    @item.update_attributes! params[:item]
    render :action => 'edit'
  end
  
  def edit
    @item = Item.find params[:id]
  end
  
    
end
