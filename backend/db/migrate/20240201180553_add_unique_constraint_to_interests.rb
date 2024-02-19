class AddUniqueConstraintToInterests < ActiveRecord::Migration[7.0]
  def change
    add_index :interests, [:user_id, :field_id], unique: true
  end
end
