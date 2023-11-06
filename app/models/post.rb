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
  
  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :followers, through: :passive_follows, source: :follower

end
