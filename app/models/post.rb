class Post < ApplicationRecord
  belongs_to :users, class_name: "User", foreign_key: :user_id
  belongs_to :fields, class_name: "Field", foreign_key: :field_id
  belongs_to :sub_fields, class_name: "Field", foreign_key: :field
  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :reviews, class_name: "Review", dependent: :destroy
  has_many :tags, through: :set_tags, class_name: "Tag", dependent: :destroy
  has_many :set_tags, class_name: "SetTag", dependent: :destroy  

end
