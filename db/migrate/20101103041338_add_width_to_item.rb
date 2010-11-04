class AddWidthToItem < ActiveRecord::Migration
  def self.up
    add_column :items, :width, :integer
    add_column :items, :height, :integer
  end

  def self.down
    remove_column :items, :width
    remove_column :items, :height
  end
end
