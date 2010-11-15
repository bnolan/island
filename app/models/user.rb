class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :rememberable, :trackable, :validatable, :oauthable, :token_authenticatable,
    :database_authenticatable, :registerable, :recoverable
  
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    data = ActiveSupport::JSON.decode(access_token.get('https://graph.facebook.com/me?'))
    if user = User.find_by_email(data["email"])
      user
    else # Create an user with a stub password. 
      User.create!(:email => data["email"], :password => Devise.friendly_token[0,20]) 
    end 
  end
  
end
