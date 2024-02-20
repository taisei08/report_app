class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts, primary_key: "post_id" do |t|
      t.integer :user_id, null: false
      t.string :title, null: false, limit: 80
      t.string :description, null: false, limit: 400
      t.integer :field_id, null: false
      t.integer :sub_field_id, null:false
      t.string :document_type, null:false, limit: 10
      t.string :document_path, null:false
      t.timestamps
    end
  end
end

