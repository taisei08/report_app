class Field < ApplicationRecord
  has_many :users, through: :interests, class_name: "User"
  has_many :interests, class_name: "Interest"
  has_many :posts, class_name: "Post"
  has_many :sub_field_posts, class_name: 'Post', foreign_key: 'sub_field_id'

  def self.ransackable_attributes(auth_object = nil)
    ["field_name"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["posts"]
  end

end
