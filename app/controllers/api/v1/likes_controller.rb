class Api::V1::LikesController < ApplicationController

  def index
    @like_users = Like.joins(:user)      
    .select("users.user_name", "users.icon_path", "users.profile_statement")
    .where(like_params)
    .order("created_at DESC")
    .page(params[:page])
    .per(20)

    render json: { status: 200, likes: @like_users}
  end

  def create
    @like = current_api_v1_user.likes.new(like_include_user_params)
    if @like.save
      render json: { status: 'success', message: 'Post created successfully' }
    else
      render json: { status: 'error', message: @like.errors.full_messages.join(', ') }
    end
  end

  def destroy
    @like = current_api_v1_user.likes
    .find(like_params)
    if @like.destroy
      render json: { message: '投稿が削除されました' }, status: :ok
    else
      render json: { error: '投稿の削除に失敗しました' }, status: :unprocessable_entity
    end
  end

  private

  def like_params
      params.permit(:post_id, :review_id, :reply_id)
  end

  def like_include_user_params
    params.permit(:user_id :post_id, :review_id, :reply_id)
end
end
