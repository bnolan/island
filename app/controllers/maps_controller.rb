class MapsController < ApplicationController
  before_filter :authenticate_user!
    
  def create
    Stack.delete_all
    
    params[:stacks].each do |index, stack|
      Stack.create! stack
    end
    
    render :json => { :success => true }
  end
  
  def update
  end
  
end
