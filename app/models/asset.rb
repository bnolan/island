class Asset < ActiveRecord::Base
  has_attached_file :upload

  def self.kinds
    %w/tile item player/
  end
  
  def image?
    upload.content_type.match /^image/
  end
  
  def upload_url
    upload.url
  end

  def height=(h)
    self.north = h 
    self.east = h 
    self.south = h 
    self.west = h 
  end
  
end
