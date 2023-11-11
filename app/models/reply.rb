class Reply < ApplicationRecord
  belongs_to :user, class_name: "User", foreign_key: :user_id
  belongs_to :review, class_name: "Review", foreign_key: :review_id
  has_many :likes, class_name: "Like", dependent: :destroy
  has_many :notifications
end