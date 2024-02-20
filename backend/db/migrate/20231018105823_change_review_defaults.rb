class ChangeReviewDefaults < ActiveRecord::Migration[6.0]
  def change
    change_column_default :reviews, :review, ''
    change_column_default :reviews, :value, 0
  end
end