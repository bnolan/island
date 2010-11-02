class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.integer :x, :y, :z, :asset_id
      
      t.string :name, :description, :code

      t.timestamps
    end
    
    add_column :assets, :kind, :string, :default => 'tile'
    add_column :assets, :width, :integer
    add_column :assets, :height, :integer
    add_column :assets, :anchor_x, :integer
    add_column :assets, :anchor_y, :integer
    
    execute "update assets set kind = 'tile'"
  end

  def self.down
    drop_table :items

    remove_column :assets, :kind
  end
end
