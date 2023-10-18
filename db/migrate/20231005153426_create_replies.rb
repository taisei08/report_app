class CreateReplies < ActiveRecord::Migration[7.0]
  def change
    create_table :replies, primary_key: "reply_id" do |t|
      t.integer :user_id, null: false
      t.integer :post_id, null: false
      t.string :reply, null: false, limit: 1000
      t.timestamps
    end
  end
end
