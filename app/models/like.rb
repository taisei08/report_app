class Like < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :post, class_name: "Post", optional: true
  belongs_to :review, class_name: "Review", optional: true
  belongs_to :reply, class_name: "Reply", optional: true
  has_one :notification, class_name: "Notification"

    mount_uploader :icon_path, ImageUploader


  def create_notification_like!(current_api_v1_user, key, value)
    passive_user = nil

    case key[0]
    when 'post_id'
      passive_user = Post.find(value) if Post.exists?("#{value[0]}")
    when 'review_id'
      passive_user = Review.find(value) if Review.exists?("#{value[0]}")
    when 'reply_id'
      passive_user = Reply.find(value) if Reply.exists?("#{value[0]}")
    end

    temp = Notification.where(["active_user_id = ? and passive_user_id = ? and #{key[0]} = ? and action = ? ", user_id, passive_user[0].user_id, value[0], 'like'])

    if temp.blank?
      notification = current_api_v1_user.active_notifications.new(
        key[0].to_sym => value[0],
        passive_user_id: passive_user[0].user_id,
        action: 'like'
      )
      if notification.active_user_id != notification.passive_user_id
        notification.save if notification.valid?
      end
    end
    return true
  end
end
