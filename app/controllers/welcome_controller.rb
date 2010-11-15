class WelcomeController < ApplicationController
  layout false
  # before_filter :authenticate_user!  
  
  def index
    if not current_user
      render :action => 'begin'
      return
    end
    
    @player = current_user

    @player.x = 250
    @player.y = 160
    @player.z = 150
    @player.save
  end
  
end
