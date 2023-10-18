class AddUniqueConstraintToTags < ActiveRecord::Migration[7.0]
  def change
    add_index :tags, :tag_name, unique: true
  end
end
