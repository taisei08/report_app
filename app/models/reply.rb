class Reply < ApplicationRecord
  belongs_to :users, class_name: "User", foreign_key: :user_id
  belongs_to :reviews, class_name: "Review", foreign_key: :review_id
end
