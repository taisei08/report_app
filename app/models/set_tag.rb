class SetTag < ApplicationRecord
  belongs_to :post, class_name: "Post", foreign_key: :post_id
  belongs_to :tag, class_name: "Tag", foreign_key: :tag_id    
end
