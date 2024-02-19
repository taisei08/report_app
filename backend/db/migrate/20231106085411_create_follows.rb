class CreateFollows < ActiveRecord::Migration[7.0]
  def change
    create_table :follows do |t|
      t.integer :follower_id, null: false, default: 0
      t.integer :followed_id, null: false, default: 0

      t.timestamps
    end
  end
end