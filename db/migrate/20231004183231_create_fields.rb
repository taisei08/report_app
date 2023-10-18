class CreateFields < ActiveRecord::Migration[7.0]
  def change
    create_table :fields, primary_key: "field_id" do |t|
      t.string :field_name, null: false, limit: 15
    end
  end
end
