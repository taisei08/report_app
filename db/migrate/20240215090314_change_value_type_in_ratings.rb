class ChangeValueTypeInRatings < ActiveRecord::Migration[7.0]
  def change
    change_column :ratings, :value, :float
  end
end
