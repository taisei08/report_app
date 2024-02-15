class Api::V1::PostDetailController < ApplicationController

  def index
    user_id = current_api_v1_user&.user_id
    post_id = post_detail_params[:post_id]
  
    @post = Post.joins(:user)
            .select("users.user_id", "users.user_name", "users.icon_path", "posts.*")
            .find(post_id)
  
    if @post.nil?
      render json: { status: 404, message: "Post not found" }
      return
    end
  
    @post.icon_path = @post.user.icon_path.url
    tag_names = SetTag.joins(:tag).where(post_id: @post.post_id).pluck("tags.tag_name")
    @post[:tags] = tag_names
    is_owner = @post.user_id == user_id ? true : false
  
    render json: { status: 200, post: @post, is_owner: is_owner }
  end  

  private

    def post_detail_params
    params.permit(:post_id)
  end
end
