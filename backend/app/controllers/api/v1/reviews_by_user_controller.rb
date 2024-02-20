class Api::V1::ReviewsByUserController < ApplicationController

  def index
    @reviews = Review.joins(:user, :post)
      .select("users.user_id", "users.user_name", "users.icon_path", "posts.post_id",
        "posts.title", "posts.created_at as post_created_at", "reviews.review_id",
        "reviews.review", "reviews.created_at as review_created_at")
      .where('reviews.user_id' => review_params[:user_id])
      .order("reviews.created_at DESC")
      .page(review_params[:page])
      .per(10)

    @reviews.each do |review|
      review.icon_path = review.user.icon_path.url
      review.value = Rating.find_by(user_id: review.user_id, post_id: review.post_id)&.value || 0
    end

    render json: { status: 200, reviews: @reviews}
  end

  private

  def review_params
    params.permit(:user_id, :page)
  end

end