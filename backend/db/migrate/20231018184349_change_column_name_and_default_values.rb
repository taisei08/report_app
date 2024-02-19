class ChangeColumnNameAndDefaultValues < ActiveRecord::Migration[6.0]
  def change
    rename_column :users, :fuculty_department, :faculty_department
    change_column :users, :account_name, :string, null: false, default: ''
  end
end
