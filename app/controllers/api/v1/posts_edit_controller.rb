class Api::V1::PostsEditController < ApplicationController

  def index
    @posts = Post      
    .select("posts.*")
    .where(post_id: post_params[:post_id])
    p "フェイオッjフィオ絵wじょいfw"
    p params

    @posts.each do |post|
      tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      # タグ名をTagモデルのインスタンスに変換してtags属性に代入
      post[:tags] = tag_names
    end
    
    render json: { status: 200, posts: @posts}
  end

  private
  
  def post_params
      params.permit(:post_id)
  end

end
