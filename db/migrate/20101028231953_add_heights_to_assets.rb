class AddHeightsToAssets < ActiveRecord::Migration
  def self.up
    add_column :assets, :height_west, :integer
    add_column :assets, :height_north, :integer
    add_column :assets, :height_east, :integer
    add_column :assets, :height_south, :integer
  end

  def self.down
  end
end
