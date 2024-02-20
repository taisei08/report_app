class AddReplyIdToNotifications < ActiveRecord::Migration[6.0]
  def change
    add_column :notifications, :reply_id, :integer
    add_index :notifications, :reply_id
  end
end