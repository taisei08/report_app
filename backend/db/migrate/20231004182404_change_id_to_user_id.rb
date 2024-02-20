class ChangeIdToUserId < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :id, :user_id
  end

end
