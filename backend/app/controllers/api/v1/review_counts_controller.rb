class Api::V1::ReviewCountsController < ApplicationController

  def index
    length = Review.where('reviews.user_id' => post_params[:user_id]).count
    render json: { status: 200, length: length }
  end

  private

  def post_params
    params.permit(:user_id)
  end
  
end
