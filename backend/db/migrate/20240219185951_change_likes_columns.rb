class ChangeLikesColumns < ActiveRecord::Migration[7.0]
  def change
    change_column_null :likes, :user_id, true
    change_column_default :likes, :user_id, nil
    change_column_null :likes, :post_id, true
    change_column_default :likes, :post_id, nil
    change_column_null :likes, :review_id, true
    change_column_default :likes, :review_id, nil
    change_column_null :likes, :reply_id, true
    change_column_default :likes, :reply_id, nil
  end
end
