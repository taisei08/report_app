class Tag < ApplicationRecord
  has_many :set_tags, class_name: "SetTag"
  has_many :posts, through: :set_tags, class_name: "Post"

  def self.ransackable_attributes(auth_object = nil)
    ["tag_name"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["posts"]
  end
  
end
