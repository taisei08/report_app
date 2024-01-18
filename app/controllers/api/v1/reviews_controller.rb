class Api::V1::ReviewsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:create, :update]

  def index
    @review = Review
    .joins(:user)
    .select("users.user_name", "users.icon_path", "reviews.*")
    .where(post_id: review_index_params[:post_id])
    .order(created_at: :desc)
    
    user_id = current_api_v1_user&.id

    @review.each do |review|
      review.icon_path = review.user.icon_path.url
    end

    @review.each do |review|
      reply_length = Reply.joins(:review)      
      .where('reviews.review_id' => review.review_id)
      .count
      review[:reply_length] = reply_length
    end

    render json: { status: 'success', current_user_id: user_id, reviews: @review }
  end

  def create
    @review = current_api_v1_user.reviews.new(review_create_params)
    @post = @review.post

    action_result = nil

    existing_review = current_api_v1_user.reviews.find_by(user_id: review_create_params[:user_id], post_id: review_create_params[:post_id])

    user = Post
    .joins(:user)
    .select("users.user_id")
    .where('posts.post_id' => review_create_params[:post_id])
    .pluck(:user_id)

    p user[0]
    p current_api_v1_user.id

    @review.transaction do
      if user[0] != current_api_v1_user.id
        @review.save
        @post.save_notification_review!(current_api_v1_user, @review.review_id)
        render json: { status: 'success', message: 'Review operation successful' }
      else
        render json: { status: 'error', message: 'Review operation failed' }
      end
    end

  end

  def update
    p "エジフェイw"
    p current_api_v1_user.reviews.find(review_update_params[:id])
    @review = current_api_v1_user.reviews.find(review_update_params[:id])


    if @review.update(review: review_update_params[:review])
      render json: { message: 'Review updated successfully' }, status: :ok
    else
      render json: { error: 'Review update failed' }, status: :unprocessable_entity
    end
  end

  def destroy
    @review = current_api_v1_user.reviews
    .find(review_destroy_params[:id])
    if @review.destroy
      render json: { message: 'Review Deleted' }, status: :ok
    else
      render json: { error: 'Review Delete Failed' }, status: :unprocessable_entity
    end
  end

  private
  
  def review_index_params
    params.permit(:post_id)
  end

  def review_create_params
    params.permit(:post_id, :review).merge(user_id: current_api_v1_user.id)
  end

  def review_update_params
    params.permit(:id, :review)
  end

  def review_destroy_params
    params.permit(:id)
  end

end

