class Api::V1::UsersController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :update]

  def index
    user_data = current_api_v1_user.slice(:user_id,:user_name,
    :account_name, :profile_statement, :icon_path, :school,
    :faculty_department, :birthday)
    render json: user_data
  end

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
    params.permit(:account_name, :profile_statement, :icon_path, :birthday,
    :school, :faculty_department, :user_name)
  end

end