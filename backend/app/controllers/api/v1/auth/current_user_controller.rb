class Api::V1::Auth::CurrentUserController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index]

  def index
    if current_api_v1_user
      render json: { status: 200, current_user: current_api_v1_user }
    else
      render json: { status: 500, message: "ユーザーが存在しません" }
    end
  end
  
end
