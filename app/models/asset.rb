class Asset < ActiveRecord::Base
  has_attached_file :upload
  
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
