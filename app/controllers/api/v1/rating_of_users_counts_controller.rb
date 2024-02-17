class Api::V1::RatingOfUsersCountsController < ApplicationController
  def index
    @rating_count = Rating
    .where(like_params)
    .count
  
    render json: { status: 200, count: @rating_count }
  end

  private

  def like_params
    params.permit(:post_id)
  end
end
