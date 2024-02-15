class Api::V1::ReviewsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:create, :update]

  def index
    post_id = review_index_params[:post_id]
    user_id = current_api_v1_user&.user_id
  
    @reviews = Review
      .joins(:user)
      .select("users.user_name", "users.icon_path", "reviews.*")
      .where(post_id: post_id)
      .order(created_at: :desc)
      
    @reviews.each do |review|
      review.icon_path = review.user.icon_path.url
      reply_length = Reply.joins(:review)      
                            .where(reviews: {review_id: review.review_id})
                            .count
      review[:reply_length] = reply_length
      value = Rating.find_by(user_id: review.user_id, post_id: review.post_id)&.value
      review[:value] = value if value
    end
  
    user_review = Review
      .joins(:user)
      .select("users.user_name", "users.icon_path", "reviews.*")
      .find_by(user_id: user_id, post_id: post_id)

    if user_review
      user_review.icon_path = user_review.user.icon_path.url
      rating = Rating.find_by(user_id: user_review.user_id, post_id: user_review.post_id)
      user_review.value = rating&.value if rating
    else
      rating = Rating.find_by(user_id: user_id, post_id: post_id)
      user_review = Review.new(user_id: 0, post_id: 0, review: '', value: rating.value) if rating
    end

  
    if user_review && user_id
      @reviews = @reviews.reject { |review| review.user_id == user_id }
      render json: { status: 'success', reviews: @reviews, own_review: user_review, current_user_id: user_id }
    elsif user_id
      render json: { status: 'success', reviews: @reviews, own_review: false, current_user_id: user_id }
    else
      render json: { status: 'success', reviews: @reviews, own_review: false, current_user_id: false }
    end    
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

