class Api::V1::PostCountsController < ApplicationController
  def index
    length = Post.joins(:user)      
    .where('users.user_id' => post_params[:user_id])
    .count

    p post_params[:user_id]
    p "ああああ"

    render json: { status: 200, length: length }

  end

  private

  def post_params
    params.permit(:user_id)
  end

end
