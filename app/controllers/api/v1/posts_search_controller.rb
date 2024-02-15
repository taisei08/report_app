class Api::V1::PostsSearchController < ApplicationController

  def index
    p params[:q]
    @q = Post.joins(:user)
      .ransack(title_or_description_or_tags_tag_name_or_field_field_name_or_sub_field_field_name_cont: params[:q])
    @posts = @q.result(distinct: true)
    .select("users.user_name", "users.icon_path", "posts.*")
    .page(params[:page])
    .per(20)

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
      average_rating = post.ratings.average(:value)
      post[:average_rating] = average_rating
    end

    puts @q
    p @q.result.to_sql
    render json: { status: 200, posts: @posts}
  end

  private

  def query
    params.permit(:q)
  end

end
