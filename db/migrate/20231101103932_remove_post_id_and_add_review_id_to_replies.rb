class RemovePostIdAndAddReviewIdToReplies < ActiveRecord::Migration[6.0]
  def up
    remove_column :replies, :post_id
    add_column :replies, :review_id, :integer, null: false
  end

  def down
    add_column :replies, :post_id, :integer
    remove_column :replies, :review_id
  end
end