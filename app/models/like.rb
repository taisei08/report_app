class Like < ApplicationRecord
  belongs_to :user class_name: "User", foreign_key: :user_id
  belongs_to :post class_name: "Post", foreign_key: :post_id
  belongs_to :review class_name: "Review", foreign_key: :review_id
  belongs_to :reply class_name: "Reply", foreign_key: :reply_id
end
