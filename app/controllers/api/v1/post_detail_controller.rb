class Api::V1::PostDetailController < ApplicationController

  def index

    @posts = Post.joins(:user)
      .select("users.user_name", "posts.*")
      .where(post_id: post_detail_params[:post_id])

    p "見てみて"
    p post_detail_params[:post_id]
    @posts.each do |post|
      tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      # タグ名をTagモデルのインスタンスに変換してtags属性に代入
      post[:tags] = tag_names
    end

    render json: { status: 200, posts: @posts}



  end

  private

    def post_detail_params
    params.permit(:post_id)
  end
end
