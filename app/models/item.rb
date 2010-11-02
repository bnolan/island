class Item < ActiveRecord::Base
  belongs_to :asset
  
  def location
    "#{x}, #{y}, #{z}"
  end
  
end
