class Api::V1::FollowAndPostCountsController < ApplicationController

  def index
    
    begin
      user_id = follow_params[:user_id]
      user = User.find(user_id)
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "User not found" }, status: :not_found
    end
  
    posts_count = Post.joins(:user)
                     .where(users: { user_id: user_id })
                     .count
    followings_count = user.followings.count
    followers_count = user.followers.count
  
    render json: { status: 200, posts: posts_count, followings: followings_count, followers: followers_count }
  end
  

  private
  
  def follow_params
    params.permit(:user_id)
  end
end
