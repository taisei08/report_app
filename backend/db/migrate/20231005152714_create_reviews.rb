class CreateReviews < ActiveRecord::Migration[7.0]
  def change
    create_table :reviews, primary_key: "review_id" do |t|
      t.integer :user_id, null: false
      t.integer :post_id, null: false
      t.string :review, null: false, limit: 1000
      t.timestamps
    end
  end
end