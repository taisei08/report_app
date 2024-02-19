class CreateTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tags, primary_key: "tag_id" do |t|
      t.string :tag_name, null: false, limit: 20
    end
  end
end
