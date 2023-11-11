class Api::V1::FollowsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :create, :destroy]

  def index
    p "ああ"
    puts params
    user = User.find(follow_params[:user_id])

    render json: { status: 200, is_following: current_api_v1_user.following?(user)}
  end

  # フォローを作成
  def create
    @user = User.find(follow_params[:user_id])
    if @user.user_id != current_api_v1_user.user_id
      if current_api_v1_user.follow(@user)
        @user.create_notification_follow!(current_api_v1_user)
        render json: { message: 'Follow Succeeded' }, status: :ok
      else
        render json: { error: 'Follow Failed' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Follow Failed' }, status: :unprocessable_entity
    end
  end

  # フォローを解除
  def destroy
    user = User.find(follow_destroy_params[:id])
    if current_api_v1_user.unfollow(user)
      render json: { message: 'Follow Delete Succeeded' }, status: :ok
    else
      render json: { error: 'Follow Delete Failed' }, status: :unprocessable_entity
    end
  end

  private

  def follow_params
    params.permit(:user_id)
  end

  def follow_destroy_params
    params.permit(:id)
  end

end
