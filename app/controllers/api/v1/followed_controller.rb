class Api::V1::FollowedController < ApplicationController

  def index

    user = User.find(follow_params[:following_id])
    @followers = user.followers
    .page(params[:page])
    .per(10)

    p "フィオ"
    p follow_params[:following_id]
    p @followers

    render json: { status: 200,
    followers: @followers
    }

  end

  private
  
  def follow_params
    params.permit(:following_id)
  end

end