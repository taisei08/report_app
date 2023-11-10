class RemoveDefaultAndNotNullConstraintsFromLikes < ActiveRecord::Migration[7.0]
  def up
    change_column :likes, :user_id, :integer, null: true, default: nil
    change_column :likes, :post_id, :integer, null: true, default: nil
    change_column :likes, :review_id, :integer, null: true, default: nil
    change_column :likes, :reply_id, :integer, null: true, default: nil
  end

  def down
    change_column :likes, :user_id, :integer, null: false, default: 0
    change_column :likes, :post_id, :integer, null: false, default: 0
    change_column :likes, :review_id, :integer, null: false, default: 0
    change_column :likes, :reply_id, :integer, null: false, default: 0
  end
end