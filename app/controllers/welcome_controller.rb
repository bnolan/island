class WelcomeController < ApplicationController
  layout false
  before_filter :authenticate_user!  
  
  def index
    @player = current_user

    @player.x = 250
    @player.y = 360
    @player.z = 150
    @player.save
  end
  
end
