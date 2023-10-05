class Tag < ApplicationRecord
  has_many :posts, through: :set_tags, class_name: "Post"
  has_many :set_tags, class_name: "SetTag"
end
