class Tag < ApplicationRecord
  has_many :set_tags, class_name: "SetTag"

  def self.ransackable_attributes(auth_object = nil)
    ["tag_name"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["posts"]
  end
  
end
