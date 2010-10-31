class CreateStacks < ActiveRecord::Migration
  def self.up
    create_table :stacks do |t|
      t.integer :x, :y
      t.string :tiles
      
      t.timestamps
    end
  end

  def self.down
    drop_table :stacks
  end
end
