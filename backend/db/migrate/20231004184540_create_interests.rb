class CreateInterests < ActiveRecord::Migration[7.0]
  def change
    create_table :interests, primary_key: "interest_id" do |t|
      t.integer :user_id, null: false
      t.integer :field_id, null: false
      t.timestamps
    end
  end
end
