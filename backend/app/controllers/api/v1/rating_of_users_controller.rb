class Api::V1::RatingOfUsersController < ApplicationController

  def index

    unless Post.find(rating_params[:post_id])
      render json: { status: 404, message: "post not found" }, status: :not_found
      return
    end
    
    @rating_users = Rating.joins(:user, :post)      
    .select("ratings.id", "ratings.value", "ratings.created_at AS rating_created_at", 
    "posts.title", "posts.user_id", "users.user_id", "users.user_name", 
    "users.icon_path", "users.account_name")
    .where.not(value: 0)
    .where(post_id: rating_params[:post_id])
    .order("rating_created_at DESC")
    .page(rating_params[:page])
    .per(10)

    @rating_users.each do |rating|
      rating.icon_path = rating.user.icon_path.url
    end

    render json: { status: 200, ratings: @rating_users}
  end

  private

  def rating_params
    params.permit(:post_id, :page)
  end

end
