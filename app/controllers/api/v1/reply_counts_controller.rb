class Api::V1::ReplyCountsController < ApplicationController
  def index
    length = Reply.joins(:review)      
    .where('reviews.review_id' => reply_params[:review_id])
    .count

    p reply_params[:review_id]
    p "ああああ"

    render json: { status: 200, length: length }

  end

  private

  def reply_params
    params.permit(:review_id)
  end

end
