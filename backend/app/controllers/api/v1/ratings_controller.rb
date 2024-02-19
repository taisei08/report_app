class Api::V1::RatingsController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:create]

  def create
    @rating = current_api_v1_user.ratings.new(rating_params)
    action_result = nil
    existing_rating = current_api_v1_user.ratings.find_by(post_id: rating_params[:post_id])

    if existing_rating
      action_result = existing_rating.update(value: rating_params[:value])
    else
      action_result = @rating.save
    end
    
    if action_result
      render json: { status: 'success', message: 'Rating operation successful' }
    else
      render json: { status: 'error', message: 'Rating operation failed' }
    end

  end

  private

  def rating_params
    params.permit(:post_id, :value)
  end
  
end
