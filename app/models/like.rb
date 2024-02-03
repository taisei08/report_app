class Like < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :post, class_name: "Post", optional: true
  belongs_to :review, class_name: "Review", optional: true
  belongs_to :reply, class_name: "Reply", optional: true
  has_one :notification, class_name: "Notification"

  def create_notification_like!(current_api_v1_user, key, value)

    passive_user = nil
    p "joipvfropk"
    puts "#{value[0]}"

    # key によって条件分岐
    case key[0]
    when 'post_id'
      # post_id の場合は Post テーブルからユーザーIDを取得
      passive_user = Post.find(value) if Post.exists?("#{value[0]}")
    when 'review_id'
      # review_id の場合は Review テーブルからユーザーIDを取得
      passive_user = Review.find(value) if Review.exists?("#{value[0]}")
    when 'reply_id'
      # reply_id の場合は Reply テーブルからユーザーIDを取得
      passive_user = Reply.find(value) if Reply.exists?("#{value[0]}")
    end

    # すでに「いいね」されているか検索
    temp = Notification.where(["active_user_id = ? and passive_user_id = ? and #{key[0]} = ? and action = ? ", user_id, passive_user[0].user_id, value[0], 'like'])
    p "jiferjoiero"
    puts user_id
    p passive_user[0].user_id
    p value
    p key[0]
    p temp
    # いいねされていない場合のみ、通知レコードを作成
    if temp.blank?
      notification = current_api_v1_user.active_notifications.new(
        key[0].to_sym => value[0],
        passive_user_id: passive_user[0].user_id,
        post_id: key[0] == 'review_id' || key[0] == 'reply_id' ? passive_user[0].post.post_id : value[0],
        action: 'like'
      )
      # 自分の投稿に対するいいねの場合は、通知済みとする
      if notification.active_user_id != notification.passive_user_id
        notification.save if notification.valid?
      end
    end
  end
end
