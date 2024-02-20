class ChangeUserAttributes < ActiveRecord::Migration[7.0]
  def change
    change_column :users, :user_name, :string, limit: 32
    change_column :users, :account_name, :string, limit: 50
  end
end
