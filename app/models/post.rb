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
  has_many :notifications, class_name: "Notification", dependent: :destroy

  def save_notification_review!(current_api_v1_user, review_id)
    # コメントは複数回することが考えられるため、１つの投稿に複数回通知する
    temp = Notification.where(["active_user_id = ? and passive_user_id = ? and action = ? ",current_api_v1_user.user_id, user_id, 'review'])
    if temp.blank?
    notification = current_api_v1_user.active_notifications.new(
      post_id: post_id,
      review_id: review_id,
      passive_user_id: user_id,
      action: 'review'
    )
    notification.save if notification.valid?
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    ["title", "description", "tag_name", "field_name"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["tags", "field", "sub_field"]
  end

end
