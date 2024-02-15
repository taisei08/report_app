class Api::V1::ReviewOfPostCountsController < ApplicationController

  def index
    length = Review     
    .where(post_id: post_params[:post_id])
    .count

    render json: { status: 200, length: length }

  end

  private

  def post_params
    params.permit(:post_id)
  end
  
end
