class Api::V1::ReviewOrReplySpottedController < ApplicationController

  def index
    @resource = Review
    .joins(:user)
    .select("users.user_name", "users.icon_path", "reviews.*")
    .where(resource_params)
    
    @resource.each do |resource|
      resource.icon_path = resource.user.icon_path.url
    end

    @resource.each do |resource|
      reply_length = Reply.joins(:review)      
      .where('reviews.review_id' => resource.review_id)
      .count
      resource[:reply_length] = reply_length
    end

    render json: { status: 'success', resource: @resource }
  end

  private

  def resource_params
    params.permit(:review_id, :reply_id)
  end

end
