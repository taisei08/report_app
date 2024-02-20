class Api::V1::FollowsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :create, :destroy]

  def index
    begin
      user = User.find(follow_params[:user_id])
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    is_following = current_api_v1_user.following?(user)
  
    render json: { status: 200, is_following: is_following, user_id: current_api_v1_user.user_id }
  end  

  def create
    begin
      @user = User.find(follow_params[:user_id])
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    if @user.user_id == current_api_v1_user.user_id
      return render json: { error: "You cannot follow yourself" }, status: :unprocessable_entity
    end
  
    if current_api_v1_user.follow(@user)
      @user.create_notification_follow!(current_api_v1_user)
      render json: { message: 'Follow succeeded' }, status: :ok
    else
      render json: { error: 'Follow failed' }, status: :unprocessable_entity
    end
  end  

  def destroy
    begin
      user = User.find(follow_destroy_params[:id])
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    if current_api_v1_user.unfollow(user)
      render json: { message: 'Follow deletion succeeded' }, status: :ok
    else
      render json: { error: 'Follow deletion failed' }, status: :unprocessable_entity
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
