class Api::V1::LikeCountsController < ApplicationController

  def index
    @like_count = Like
    .where(like_params)
    .count
    

    is_liked = current_api_v1_user.present? && 
    current_api_v1_user.likes.exists?(like_params)


    render json: { status: 200, count: @like_count, is_liked: is_liked}
  end

  private

  def like_params
    params.permit(:post_id, :review_id, :reply_id)
  end

  def like_include_user_params
    params.permit(:user_id, :post_id, :review_id, :reply_id)
  end

end