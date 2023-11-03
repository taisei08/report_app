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

  def update
    @post = Post.find(post_params[:post_id])

    tag_names = JSON.parse(post_params[:tag_name])
    p tag_names

    if @post.update(update_params) # post_paramsは許可されたパラメータを取得するメソッド
      existing_tags = tag_names.map do |tag_info|
        existing_tag = Tag.find_by(tag_info)
        existing_tag ||= @post.tags.create(tag_info)
        existing_tag
      end

      param_tag_names = tag_names.map { |tag_info| tag_info["tag_name"] }
    
      # 既存のset_tagを取得
      existing_set_tags = @post.set_tags.to_a
  
      # 不要なset_tagを特定して削除
      (existing_set_tags.reject { |set_tag| param_tag_names.include?(set_tag.tag.tag_name) }).each(&:destroy)

      Tag.where.not(tag_id: SetTag.select(:tag_id).distinct).destroy_all

      render json: { message: 'Post updated successfully' }, status: :ok
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  
  def post_params
      params.permit(:post_id, :title, :description,
      :field_id, :sub_field_id, :tag_name)
  end

  def update_params
    params.permit(:title, :description, :field_id, :sub_field_id)
  end

end
