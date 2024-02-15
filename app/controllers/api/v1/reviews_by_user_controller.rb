class Api::V1::ReviewsByUserController < ApplicationController

  def index
    @reviews = Post.joins(:user, :reviews, :ratings)      
    .select("users.user_id", "users.user_name", "users.icon_path", "posts.post_id",
      "posts.title", "posts.created_at as post_created_at", "reviews.review_id",
      "reviews.review", "reviews.created_at as review_created_at",
      "ratings.value")
    .where('reviews.user_id' => review_params[:user_id])
    .order("reviews.created_at DESC")
    .page(params[:page])
    .per(10)
  

    @reviews.each do |post|
      post.icon_path = post.user.icon_path.url
    end

    p @reviews
    render json: { status: 200, reviews: @reviews}

  end


  private

  def review_params
    params.permit(:user_id)
  end

end