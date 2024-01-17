class Api::V1::UsersIconController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index]

  def index
    icon = current_api_v1_user.slice(:icon_path)
    render json: icon
  end

end
