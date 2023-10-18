class Api::V1::ReviewsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :create]

  def index
    @review = Review
    .joins(:user)
    .select("users.user_name", "reviews.*")
    .where(post_id: review_index_params[:post_id])
    .order(created_at: :desc)
    
    user_id = current_api_v1_user&.id

    render json: { status: 'success', current_user_id: user_id, reviews: @review }
  end

  def create
    @review = current_api_v1_user.reviews.new(review_create_params)

    action_result = nil

    existing_review = current_api_v1_user.reviews.find_by(user_id: review_create_params[:user_id], post_id: review_create_params[:post_id])

    @review.transaction do
      if existing_review
        action_result = existing_review.update(review: review_create_params[:review])
      else
        action_result = @review.save
      end
    end
    
      if action_result
        render json: { status: 'success', message: 'Review operation successful' }
      else
        render json: { status: 'error', message: 'Review operation failed' }
      end
  end

  private
  
  def review_index_params
    params.permit(:post_id)
  end

  def review_create_params
    params.permit(:post_id, :review).merge(user_id: current_api_v1_user.id)
  end

end

