class Api::V1::NotificationsController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:create, :destroy]

  def index
    @notifications = current_api_v1_user.passive_notifications
    .joins(:post, :active_user)
    .select("users.account_name", "posts.title", "notifications.*")
    #.order("created_at DESC")
    #.page(params[:page])
    #.per(20)
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
