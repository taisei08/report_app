class Post < ApplicationRecord

  mount_uploader :file, DocumentUploader

  belongs_to :user, class_name: "User", foreign_key: :user_id
  belongs_to :field, class_name: "Field", foreign_key: :field_id
  belongs_to :sub_field, class_name: "Field", foreign_key: :field_id
  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :reviews, class_name: "Review", dependent: :destroy
  has_many :set_tags, class_name: "SetTag", dependent: :destroy  
  has_many :tags, through: :set_tags, class_name: "Tag", dependent: :destroy

end
