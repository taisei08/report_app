class RemoveDocumentTypeFromPosts < ActiveRecord::Migration[7.0]
  def change
    remove_column :posts, :document_type
  end
end
