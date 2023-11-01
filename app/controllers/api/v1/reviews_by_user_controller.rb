class Api::V1::ReviewsByUserController < ApplicationController

  def index
    @reviews = Post.joins(:user, :reviews)      
    .select("users.user_id", "users.user_name", "users.icon_path", "posts.post_id",
    "posts.title", "posts.field_id", "posts.sub_field_id", "posts.document_path", "reviews.review",
    "reviews.created_at", "reviews.value")
    .where('reviews.user_id' => review_params[:user_id])
    .order("created_at DESC")
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