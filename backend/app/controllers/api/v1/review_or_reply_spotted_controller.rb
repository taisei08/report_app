class Api::V1::ReviewOrReplySpottedController < ApplicationController

  def index

    begin
      @review = Review
                .joins(:user)
                .select("users.user_name", "users.icon_path", "reviews.*")
                .find(review_params[:review_id])
      @review.icon_path = @review.user.icon_path.url
      @review.reply_length = Reply.where(review_id: @review.review_id).count
      @review.value = Rating.find_by(user_id: @review.user_id, post_id: @review.post_id)&.value || 0
      render json: { status: 'success', review: @review }
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Review not found' }, status: :not_found
    end

  end

  private

  def review_params
    params.permit(:review_id)
  end

end
