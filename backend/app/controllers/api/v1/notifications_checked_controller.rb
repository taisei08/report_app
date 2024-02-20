class Api::V1::NotificationsCheckedController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:index]

  def index
    @notifications = current_api_v1_user.passive_notifications
    .where(checked: false)

    if @notifications.empty?
      render json: { status: 200, checked: true }
    else
      render json: { status: 200, checked: false }
    end
  end

end
