class Api::V1::FollowAndPostCountsController < ApplicationController

  def index

    p follow_params[:user_id]

    posts = Post.joins(:user)      
    .where('users.user_id' => follow_params[:user_id])
    .count

    followings = User.find(follow_params[:user_id]).followings      
    .count

    followers = User.find(follow_params[:user_id]).followers
    .count

    render json: { status: 200,
    posts: posts,
    followings: followings,
    followers: followers }

  end

  private
  
  def follow_params
    params.permit(:user_id)
  end
end
