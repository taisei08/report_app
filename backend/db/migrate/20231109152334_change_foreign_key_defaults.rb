class ChangeForeignKeyDefaults < ActiveRecord::Migration[7.0]
  def change
    change_column_default :posts, :post_id, nil
    change_column_default :reviews, :review_id, nil
    change_column_default :replies, :reply_id, nil
  end
end
