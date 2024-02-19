class ChangeColumnNameOfNotification < ActiveRecord::Migration[7.0]
  def change
    rename_column :notifications, :read, :checked
  end
end
