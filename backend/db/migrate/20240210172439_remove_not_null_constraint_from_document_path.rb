class RemoveNotNullConstraintFromDocumentPath < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :document_type, true
  end
end