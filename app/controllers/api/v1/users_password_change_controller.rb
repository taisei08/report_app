class Api::V1::UsersPasswordChangeController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :update]

  def update
    @user = current_api_v1_user
    p "見てみて"
    p params
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:password, :password_confirmation)
  end

end
