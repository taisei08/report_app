class Api::V1::FollowedController < ApplicationController

  def index
    begin
      user = User.find(follow_params[:following_id])
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    @followers = user.followers.page(follow_params[:page]).per(10)
  
    render json: { status: 200, followers: @followers }
  end

  private
  
  def follow_params
    params.permit(:following_id, :page)
  end

end