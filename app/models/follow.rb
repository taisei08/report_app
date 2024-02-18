class Follow < ApplicationRecord

  belongs_to :follower, class_name: 'User', foreign_key: 'follower_id'
  belongs_to :followed, class_name: 'User', foreign_key: 'followed_id'

  validate :different_follower_and_followed

  def different_follower_and_followed
    if follower_id == followed_id
      errors.add(:base, "Follower and followed cannot be the same")
    end
  end

end
