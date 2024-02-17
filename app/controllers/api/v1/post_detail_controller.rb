class Api::V1::PostDetailController < ApplicationController

  def index

    begin
      user_id = current_api_v1_user&.user_id
      post_id = post_detail_params[:post_id]
      
      @post = Post.joins(:user)
                  .select("users.user_id", "users.user_name", "users.icon_path", "posts.*")
                  .find(post_id)
  
      @post.icon_path = @post.user.icon_path.url
      tag_names = SetTag.joins(:tag).where(post_id: @post.id).pluck("tags.tag_name")
      @post[:tags] = tag_names
      is_owner = @post.user_id == user_id
  
      render json: { status: 200, post: @post, is_owner: is_owner }
    rescue ActiveRecord::RecordNotFound
      render json: { status: 404, message: "Post not found" }, status: :not_found
    end
    
  end  

  private

  def post_detail_params
    params.permit(:post_id)
  end
end
