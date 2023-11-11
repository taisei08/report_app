class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.integer :active_user_id, null: false
      t.integer :passive_user_id, null: false
      t.integer :post_id
      t.integer :review_id
      t.integer :like_id
      t.string :action, default: '', null: false
      t.boolean :read, default: false, null: false

      t.timestamps
    end

    add_index :notifications, :active_user_id
    add_index :notifications, :passive_user_id
    add_index :notifications, :post_id
    add_index :notifications, :review_id
    add_index :notifications, :like_id
  end
end
