class CreateSetTags < ActiveRecord::Migration[7.0]
  def change
    create_table :set_tags, primary_key: "set_tag_id" do |t|
      t.integer :post_id, null: false
      t.integer :tag_id, null: false
    end
  end
end
