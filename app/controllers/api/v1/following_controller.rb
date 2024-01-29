class Api::V1::FollowingController < ApplicationController

  def index

    user = User.find(follow_params[:follower_id])
    @users = user.followings
    .page(params[:page])
    .per(10)

    p "フィオ"
    p follow_params[:follower_id]
    p @users

    render json: { status: 200,
    followings: @users
    }

  end

  private
  
  def follow_params
    params.permit(:follower_id)
  end

end
