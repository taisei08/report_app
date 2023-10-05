class CreateRatings < ActiveRecord::Migration[7.0]
  def change
    create_table :ratings, primary_key: "rating_id" do |t|
      t.integer :user_id, null: false
      t.integer :post_id, null: false
      t.float :value, null: false
      t.timestamps
    end
  end
end
