class Api::V1::LikesController < ApplicationController 
  before_action :authenticate_api_v1_user!, only: [:create, :destroy]

  def index
    @like_users = Like.joins(:user)      
    .select("likes.*", "users.user_name", "users.icon_path", "users.profile_statement")
    .where(like_params)
    .order("created_at DESC")
    .page(params[:page])
    .per(20)

    render json: { status: 200, likes: @like_users}
  end

  def create
    @like = current_api_v1_user.likes.new(like_params)
    p @like
    if @like.save
      render json: { status: 'success', message: 'Post created successfully' }
    else
      puts @like.errors.full_messages
      render json: { status: 'error', message: @like.errors.full_messages.join(', ') }
    end
  end

  def destroy
    @like = current_api_v1_user.likes
    .find_by(like_params)
    if @like.destroy
      render json: { message: 'Like Deleted' }, status: :ok
    else
      render json: { error: 'Like Delete Failed' }, status: :unprocessable_entity
    end
  end

  private

  def like_params
      params.permit(:post_id, :review_id, :reply_id)
  end

  def like_include_user_params
    params.permit(:user_id, :post_id, :review_id, :reply_id)
  end
end
