class RemoveValueFromReviews < ActiveRecord::Migration[7.0]
  def change
    remove_column :reviews, :value, :integer
  end
end
