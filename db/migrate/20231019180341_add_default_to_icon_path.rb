class AddDefaultToIconPath < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :icon_path, :string, null: false, default: ''
  end
end