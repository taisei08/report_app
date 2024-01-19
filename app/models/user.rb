# frozen_string_literal: true

class User < ActiveRecord::Base


  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :icon_path, ImageUploader

  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :posts, class_name: "Post", dependent: :destroy
  has_many :replies, class_name: "Reply", dependent: :destroy
  has_many :reviews, class_name: "Review", dependent: :destroy
  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :likes, class_name: "Like", dependent: :destroy
  has_many :fields, through: :interests, class_name: "Field"
  has_many :interests, class_name: "Interest", dependent: :destroy

  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :followings, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower
  has_many :active_notifications, class_name: 'Notification', foreign_key: 'active_user_id', dependent: :destroy
  has_many :passive_notifications, class_name: 'Notification', foreign_key: 'passive_user_id', dependent: :destroy



  # 指定したユーザーをフォローする
  def follow(user)
    active_follows.create(followed_id: user.id)
  end
  
  # 指定したユーザーのフォローを解除する
  def unfollow(user)
    active_follows.find_by(followed_id: user.id).destroy
  end

  def following?(user)
    followings.include?(user)
  end

  def create_notification_follow!(current_api_v1_user)
    temp = Notification.where(["active_user_id = ? and passive_user_id = ? and action = ? ",current_api_v1_user.user_id, user_id, 'follow'])
    if temp.blank?
      @notification = current_api_v1_user.active_notifications.new(
        passive_user_id: user_id,
        action: 'follow'
      )
      @notification.save if @notification.valid?
    end
  end
  
end
