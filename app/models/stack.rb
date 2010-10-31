class Stack < ActiveRecord::Base
  
  def tiles=(x)
    if x.kind_of? Hash
      # Expects a params hash like:
      #    "tiles"=>{"0"=>{"asset_id"=>"18"}}}
      
      self.tiles = x.values.collect do |tile|
        tile[:asset_id]
      end.join(",")
    elsif x.kind_of? String
      write_attribute :tiles, x
    else
      raise Exception, "Unimplemented..."
    end
  end
  
end
