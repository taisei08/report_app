class Api::V1::LikesController < ApplicationController 
  before_action :authenticate_api_v1_user!, only: [:create, :destroy]

  def index

    unless Post.find(index_params[:post_id])
      render json: { status: 404, message: "post not found" }, status: :not_found
      return
    end
    
    @like_users = Like.joins(:user)      
    .select("likes.*", "users.user_name", "users.icon_path", "users.profile_statement")
    .where(post_id: index_params[:post_id])
    .order("created_at DESC")
    .page(index_params[:page])
    .per(10)

    render json: { status: 200, likes: @like_users}
  end

  def create
    existing_like = current_api_v1_user.likes.find_by(like_params)
    
    begin
      @like = current_api_v1_user.likes.new(like_params)
    rescue ActiveRecord::RecordInvalid => e
      return render json: { status: 'error', message: e.message }, status: :unprocessable_entity
    end
  
    if existing_like.nil? && @like.save && @like.create_notification_like!(current_api_v1_user, like_params.keys, like_params.values)
      render json: { status: 'success', message: 'Like created successfully' }
    else
      render json: { status: 'error', message: @like.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end
  
  def destroy
    begin
      @like = current_api_v1_user.likes.find_by(like_params)
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "Like not found" }, status: :not_found
    end
  
    if @like.destroy
      render json: { message: 'like deleted' }, status: :ok
    else
      render json: { error: 'failed to delete like' }, status: :unprocessable_entity
    end
  end  

  private

  def index_params
    params.permit(:post_id, :page)
  end

  def like_params
      params.permit(:post_id, :review_id, :reply_id)
  end

end
