class Api::V1::NotificationsController < ApplicationController

  def index
    @notifications = current_api_v1_user.passive_notifications
    .joins(:post, :active_user)
    .select("users.user_name", "users.account_name", "users.icon_path", "posts.title", "notifications.*")
    .order("created_at DESC")
    .page(notification_params[:page])
    .per(10)

    @notifications.each do |notification|
      notification.icon_path = notification.active_user.icon_path.url
      if notification.action == 'like'
        if notification.review_id.present?
          review = Review.find(notification.review_id)
          notification.post_id = review.post.post_id
        elsif notification.reply_id.present?
          reply = Reply.find(notification.reply_id)
          notification.review_id = reply.review_id
          notification.post_id = reply.review.post.post_id
        end
      end
    end

    render json: { status: 200, notifications: @notifications}

    @notifications.each do |notification|
      notification.update(checked: true)
    end

    @notifications.where("created_at < ?", 1.month.ago).destroy_all
    
  end

  private

  def notification_params
    params.permit(:page)
  end

end
