class Notification < ApplicationRecord
  default_scope -> { order(created_at: :desc) }
  belongs_to :post, foreign_key: 'post_id', optional: true
  belongs_to :review, optional: true
  belongs_to :reply, optional: true
  belongs_to :like, optional: true

  belongs_to :active_user, class_name: 'User', foreign_key: 'active_user_id', optional: true
  belongs_to :passive_user, class_name: 'User', foreign_key: 'passive_user_id', optional: true
end
