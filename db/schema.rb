# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101104055803) do

  create_table "assets", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "height_west"
    t.integer  "height_north"
    t.integer  "height_east"
    t.integer  "height_south"
    t.string   "kind",                :default => "tile"
    t.integer  "width"
    t.integer  "height"
    t.integer  "anchor_x"
    t.integer  "anchor_y"
  end

  create_table "items", :force => true do |t|
    t.integer  "x"
    t.integer  "y"
    t.integer  "z"
    t.integer  "asset_id"
    t.string   "name"
    t.string   "description"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "width"
    t.integer  "height"
  end

  create_table "stacks", :force => true do |t|
    t.integer  "x"
    t.integer  "y"
    t.string   "tiles"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email",                               :default => "", :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "", :null => false
    t.string   "password_salt",                       :default => "", :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "x"
    t.integer  "y"
    t.integer  "z"
    t.integer  "avatar_id"
    t.string   "team"
    t.string   "character"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
