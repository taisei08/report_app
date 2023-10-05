class SetTag < ApplicationRecord
  belongs_to :posts, class_name: "Post", foreign_key: :post_id
  belongs_to :tags, class_name: "Tag", foreign_key: :tag_id    
end
