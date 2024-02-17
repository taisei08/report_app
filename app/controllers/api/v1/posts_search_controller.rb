class Api::V1::PostsSearchController < ApplicationController

  def index
    @q = Post.joins(:user)
      .ransack(title_or_description_or_tags_tag_name_or_field_field_name_or_sub_field_field_name_cont: query_params[:q])
    @posts = @q.result(distinct: true)
    .select("users.user_name", "users.icon_path", "posts.*")
    .page(query_params[:page])
    .per(20)

    @posts.each do |post|
      post.icon_path = post.user.icon_path.url
      post[:tags] = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      post[:average_rating] = post.ratings.average(:value)
    end

    render json: { status: 200, posts: @posts}
  end

  private

  def query_params
    params.permit(:q, :page)
  end

end
