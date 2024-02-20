class AddColumnsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :user_name, :string, limit: 14, unique: true, after: :tokens
    add_index :users, :user_name, unique: true
    add_column :users, :account_name, :string, limit: 50, after: :user_name
    add_column :users, :icon_path, :string, null: false, after: :account_name, default: ''
    add_column :users, :gender, :integer, null: false, after: :icon_path, default: 0
    add_column :users, :birthday, :date, null: false, after: :gender, default: '1700-01-01'
    add_column :users, :school, :string, null: false, limit: 30, after: :birthday, default: ''
    add_column :users, :fuculty_department, :string, null: false, limit: 40, after: :school, default: ''
    add_column :users, :profile_statement, :string, null: false, limit: 160, after: :fuculty_department, default: ''
    add_column :users, :twitter_link, :string, null: false, limit: 100, after: :profile_statement, default: ''
    add_column :users, :instagram_link, :string, null: false, limit: 100, after: :twitter_link, default: ''

    remove_column :users, :nickname, :string
    remove_column :users, :name, :string
    remove_column :users, :image, :string
  end
end