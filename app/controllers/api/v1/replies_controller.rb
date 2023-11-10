class Api::V1::RepliesController < ApplicationController
  # app/controllers/posts_controller.rb
  before_action :set_post, only: [:show, :edit, :destroy]
  before_action :authenticate_api_v1_user!, only: [:create]

  def index
    @replies = Reply.joins(:review, :user)      
    .select("users.user_name", "users.icon_path", "replies.*")
    .where('reviews.review_id' => reply_params[:review_id])
    .order("created_at ASC")
    .page(params[:page])
    .per(10)

    @replies.each do |reply|
      reply.icon_path = reply.user.icon_path.url
    end
    
    render json: { status: 200, replies: @replies}

  end

  def create
    @replies = current_api_v1_user.replies.new(reply_params)

    review = Review
    .select("reviews.review")
    .where('reviews.review_id' => reply_params[:review_id])
    .pluck(:review)

    p "あああああああああああああああああああああああ"
    p review[0]

    @replies.transaction do
        if review && review[0].present?
          @replies.save
          render json: { status: 'success', message: 'Post created successfully' }
        else
          render json: { status: 'error', message: @replies.errors.full_messages.join(', ') }
        end
    end
  end

  def edit
  end

  def update
    @reply = current_api_v1_user.replies.find(reply_update_params[:id])

    if @reply.update(reply: reply_update_params[:reply])
      render json: { message: 'Review updated successfully' }, status: :ok
    else
      render json: { error: 'Review update failed' }, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post was successfully destroyed.'
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def reply_params
    params.permit(:review_id, :reply)
  end

  def reply_update_params
    params.permit(:id, :reply)
  end
  

end
