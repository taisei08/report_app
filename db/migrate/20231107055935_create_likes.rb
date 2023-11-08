class CreateLikes < ActiveRecord::Migration[6.0]
  def change
    create_table :likes do |t|
      t.integer :user_id, null: false, default: 0
      t.integer :post_id, null: false, default: 0
      t.integer :review_id, null: false, default: 0
      t.integer :reply_id, null: false, default: 0

      t.timestamps
    end
    
  end
end