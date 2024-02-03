class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:create, :destroy]

  def index
    @notifications = current_api_v1_user.passive_notifications
    .left_outer_joins(:post, :active_user)
    .select("users.user_name", "users.account_name", "users.icon_path", "posts.title", "notifications.*")
    #.order("created_at DESC")
    #.page(params[:page])
    #.per(20)

    @notifications.each do |notification|
      notification.icon_path = notification.active_user.icon_path.url
    end

    p "wジオfjうぇ"
    p @notifications

    @notifications.each do |notification|
      notification.update(checked: true)
    end
    
    render json: { status: 200, notifications: @notifications}

  end

  private

  def notification_params
      params.permit(:user_id, :title, :description, :document_path, :document_type,
      :field_id, :sub_field_id)
  end

end
