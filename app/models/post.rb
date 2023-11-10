class Post < ApplicationRecord

  mount_uploader :document_path, DocumentUploader

  attribute :average_rating, :integer, default: 0
  attribute :tags, default: []
  belongs_to :user, class_name: "User", foreign_key: :user_id
  belongs_to :field, class_name: "Field", foreign_key: :field_id
  belongs_to :sub_field, class_name: 'Field', foreign_key: :sub_field_id, optional: true
  has_many :reviews, class_name: "Review", dependent: :destroy
  has_many :set_tags, class_name: "SetTag", dependent: :destroy  
  has_many :tags, through: :set_tags, class_name: "Tag", dependent: :destroy
  has_many :likes, class_name: "Like", dependent: :destroy

end
