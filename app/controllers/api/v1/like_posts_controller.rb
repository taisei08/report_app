class Api::V1::LikePostsController < ApplicationController

  def index
    
    @posts = Post.joins(:user, :likes)      
    .select("likes.user_id", "users.user_name", "users.icon_path", "posts.*")
    .where('likes.user_id' => post_params[:user_id])
    .order("created_at DESC")
    .page(params[:page])
    .per(10)

    @posts.each do |post|
      post.icon_path = post.user.icon_path.url
      tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      post[:tags] = tag_names
      average_rating = post.ratings.average(:value)
      post[:average_rating] = average_rating
    end

    render json: { status: 200, posts: @posts}

  end

  private

  def post_params
    params.permit(:user_id)
  end

end
