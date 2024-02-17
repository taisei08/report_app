class Api::V1::FollowingController < ApplicationController

  def index
    begin
      user = User.find(follow_params[:follower_id])
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    @users = user.followings.page(params[:page]).per(10)
  
    render json: { status: 200, followings: @users }
  end  

  private
  
  def follow_params
    params.permit(:follower_id)
  end

end
