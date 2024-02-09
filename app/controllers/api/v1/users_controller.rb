class Api::V1::UsersController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :update]

  def index
    @user = User
    .find(index_params[:user_id])
    field_ids = User.find(index_params[:user_id])
    .interests.pluck(:field_id)
    p @user
    render json: { user: @user, field_ids: field_ids }
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

  def index_params
    params.permit(:user_id)
  end

  def user_params
    params.permit(:account_name, :profile_statement, :icon_path, :birthday,
    :school, :faculty_department, :user_name)
  end

end