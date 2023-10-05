class Field < ApplicationRecord
  has_many :users, through: :interests, class_name: "User"
  has_many :interests, class_name: "Interest"
  has_many :posts, class_name: "Post"

end
