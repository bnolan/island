class AddXYToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :x, :integer 
    add_column :users, :y, :integer 
    add_column :users, :z, :integer
    add_column :users, :avatar_id, :integer
    add_column :users, :team, :string
    add_column :users, :character, :string
  end

  def self.down
    remove_column :users, :x
    remove_column :users, :y
    remove_column :users, :z
  end
end
