class Api::V1::PostsByUserController < ApplicationController

  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def index
    @posts = Post.joins(:user)      
    .select("users.user_name", "users.icon_path", "posts.*")
    .where('users.user_id' => post_params[:user_id])
    .order("created_at DESC")
    .page(params[:page])
    .per(10)


    @posts.each do |post|
      post.icon_path = post.user.icon_path.url
    end

    @posts.each do |post|
      tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      # タグ名をTagモデルのインスタンスに変換してtags属性に代入
      post[:tags] = tag_names
    end

    @posts.each do |post|
      # ポストに関連するレビューの平均評価を計算
      average_rating = post.reviews.average(:value)
      post[:average_rating] = average_rating
    end

    render json: { status: 200, posts: @posts}

  end


  private

  def post_params
    params.permit(:user_id)
  end

end
