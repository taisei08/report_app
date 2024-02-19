class ChangeDocumentTypeInPosts < ActiveRecord::Migration[6.0]
  def change
    change_column :posts, :document_type, :integer
  end
end