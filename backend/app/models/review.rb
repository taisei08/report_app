class Review < ApplicationRecord

  attribute :reply_length, :integer, default: 0
  attribute :value, :float, default: 0

  belongs_to :user, class_name: "User", foreign_key: :user_id
  belongs_to :post, class_name: "Post", foreign_key: :post_id
  has_many :replies, class_name: "Reply", dependent: :destroy
  has_many :likes, class_name: "Like", dependent: :destroy
  has_many :notifications, dependent: :destroy

  validates :review_id, uniqueness: { scope: :post_id, message: "has already been created for this post" }

end
