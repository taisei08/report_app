class Api::V1::PostsOfFieldController < ApplicationController
  def index
    @posts = Post
    .joins(:user)
    .select("users.user_name", "users.icon_path", "posts.*")
    .where("field_id = :field_id OR sub_field_id = :field_id", field_id: index_params[:field_id])
    .order("created_at DESC")
    .limit(15)

    @posts.each do |post|
      post.icon_path = post.user.icon_path.url
    end
    
    render json: { status: 200, posts: @posts}
  end

  private

  def index_params
    params.permit(:field_id)
  end
end
