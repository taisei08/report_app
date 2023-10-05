class Interest < ApplicationRecord
  belongs_to :users, class_name: "User", foreign_key: :user_id
  belongs_to :fields, class_name: "Field", foreign_key: :field_id
end
