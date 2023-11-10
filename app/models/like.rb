class Like < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :post, class_name: "Post", optional: true
  belongs_to :review, class_name: "Review", optional: true
  belongs_to :reply, class_name: "Reply", optional: true
end
