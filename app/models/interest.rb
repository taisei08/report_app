class Interest < ApplicationRecord
  belongs_to :users, class_name: "User", foreign_key: :user_id
  belongs_to :fields, class_name: "Field", foreign_key: :field_id

  validate :validate_max_interests

  private

  def validate_max_interests
    if Interest.where(user_id: user_id).distinct.count(:field_id) >= 3
      errors.add(:base, "User can have maximum 3 different interests")
    end
  end

end
