class ChangeValueToIntegerInRatings < ActiveRecord::Migration[6.0]
  def change
    change_column :ratings, :value, :integer
  end
end