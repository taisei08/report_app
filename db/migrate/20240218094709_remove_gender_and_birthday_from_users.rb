class RemoveGenderAndBirthdayFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :gender
    remove_column :users, :birthday
  end
end
