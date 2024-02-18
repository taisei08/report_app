class Api::V1::ReviewsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:create, :update]

  def index
    post_id = review_index_params[:post_id]
    user_id = current_api_v1_user&.user_id
  
    @reviews = Review
      .joins(:user)
      .select("users.user_name", "users.icon_path", "reviews.*")
      .where(post_id: post_id)
      .order("created_at DESC")
      .page(params[:page])
      .per(10)

    @reviews.each do |review|
      review.icon_path = review.user.icon_path.url
      review.reply_length = Reply.where(review_id: review.review_id).count
      review.value = Rating.find_by(user_id: review.user_id, post_id: review.post_id)&.value || 0
    end
  
    user_review = Review
      .joins(:user)
      .select("users.user_name", "users.icon_path", "reviews.*")
      .find_by(user_id: user_id, post_id: post_id)

    if user_review
      user_review.icon_path = user_review.user.icon_path.url
      user_review.reply_length = Reply.where(review_id: user_review.review_id).count
      user_review.value = Rating.find_by(user_id: user_review.user_id, post_id: user_review.post_id)&.value || 0
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

    existing_review = current_api_v1_user.reviews.find_by(post_id: review_create_params[:post_id])
    user_id_of_post_creator = Post.find_by(post_id: review_create_params[:post_id])&.user_id

    if user_id_of_post_creator == current_api_v1_user.user_id
      render json: { status: 'error', message: 'You cannot review your own post' }
      return
    end
    
    begin
      @review.transaction do
        @review.save
        @post.save_notification_review!(current_api_v1_user, @review.review_id)
        render json: { status: 'success', message: 'Review operation successful' }
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { status: 'error', message: e.record.errors.full_messages.join(', ') }
    end

  end

  def update

    begin
      @review = current_api_v1_user.reviews.find(review_update_params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Review not found' }, status: :not_found
    end

    if @review.update(review: review_update_params[:review])
      render json: { message: 'Review updated successfully' }, status: :ok
    else
      render json: { error: 'Review update failed', errors: @review.errors.full_messages }, status: :unprocessable_entity
    end

  end

  def destroy

    begin
      @review = current_api_v1_user.reviews.find(review_update_params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Review not found' }, status: :not_found
    end

    if @review.destroy
      render json: { message: 'Review deleted successfully' }, status: :ok
    else
      render json: { error: 'Review deletion failed' }, status: :unprocessable_entity
    end
    
  end

  private
  
  def review_index_params
    params.permit(:post_id, :page)
  end

  def review_create_params
    params.permit(:post_id, :review)
  end

  def review_update_params
    params.permit(:id, :review)
  end

  def review_destroy_params
    params.permit(:id)
  end

end

