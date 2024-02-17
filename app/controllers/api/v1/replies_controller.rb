class Api::V1::RepliesController < ApplicationController
  # app/controllers/posts_controller.rb
  before_action :authenticate_api_v1_user!, only: [:create, :update, :destroy]

  def index
    @replies = Reply.joins(:review, :user)
    .select("users.user_name", "users.icon_path", "replies.*")
    .where(reviews: { review_id: reply_params[:review_id] })
    .order(created_at: :asc)
    .page(params[:page])
    .per(10)
  
    if @replies.empty?
      latest_replies = Reply.joins(:review, :user)
      .select("users.user_name", "users.icon_path", "replies.*")
      .where(reviews: { review_id: reply_params[:review_id] })
      .order(created_at: :desc)
      .limit(10)
      .reverse
      @replies += latest_replies
    end
  
    @replies.each do |reply|
      reply.icon_path = reply.user.icon_path.url
    end
    
    render json: { status: 200, replies: @replies }
  end
  

  def create
    @reply = current_api_v1_user.replies.new(reply_params)

    begin
      review = Review.find(reply_params[:review_id])
    rescue ActiveRecord::RecordNotFound
      render json: { status: 'error', message: 'Review not found' }, status: :not_found
      return
    end

    @reply.transaction do
      if review.present?
        @reply.save
        render json: { status: 'success', message: 'Post created successfully' }
      else
        render json: { status: 'error', message: @reply.errors.full_messages.join(', ') }
      end
    end
  end

  def update
    @reply = current_api_v1_user.replies.find(reply_update_params[:id])

    if @reply.user_id != current_api_v1_user.user_id
      render json: { error: 'Unauthorized access to reply' }, status: :unauthorized
      return
    end

    if @reply.update(reply: reply_update_params[:reply])
      render json: { message: 'Review updated successfully' }, status: :ok
    else
      render json: { error: 'Review update failed' }, status: :unprocessable_entity
    end
  end

  def destroy
    @reply = current_api_v1_user.replies
    .find(reply_destroy_params[:id])

    if @reply.user_id != current_api_v1_user.user_id
      render json: { error: 'Unauthorized access to reply' }, status: :unauthorized
      return
    end
    
    if @reply.destroy
      render json: { message: 'Review Deleted' }, status: :ok
    else
      render json: { error: 'Review Delete Failed' }, status: :unprocessable_entity
    end
  end

  private

  def reply_params
    params.permit(:review_id, :reply)
  end

  def reply_update_params
    params.permit(:id, :reply)
  end

  def reply_destroy_params
    params.permit(:id)
  end
  

end
