class Api::V1::ReviewOrReplySpottedController < ApplicationController

  def index
    p review_params
    @review = Review
    .joins(:user)
    .select("users.user_name", "users.icon_path", "reviews.*")
    .find(review_params[:review_id])
    
    @review.icon_path = @review.user.icon_path.url

    reply_length = Reply.joins(:review)      
    .where('reviews.review_id' => @review.review_id)
    .count
    @review[:reply_length] = reply_length

    render json: { status: 'success', review: @review }
  end

  private

  def review_params
    params.permit(:review_id)
  end

end
