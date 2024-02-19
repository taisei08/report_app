class CreateRatings < ActiveRecord::Migration[7.0]
  def change
    create_table :ratings do |t|
      t.integer :value
      t.bigint :post_id, null: false, foreign_key: { to_table: :posts, primary_key: :post_id }
      t.bigint :user_id, null: false, foreign_key: { to_table: :posts, primary_key: :user_id }
      t.timestamps
    end
  end
end
