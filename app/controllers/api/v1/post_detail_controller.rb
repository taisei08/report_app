class Api::V1::PostDetailController < ApplicationController

  def index
    Rails.logger.debug params.inspect

    @posts = Post.joins(:user, :field, :sub_field)
      .select("users.user_name", "posts.*", "fields.field_name as main_field_name", "sub_fields_posts.field_name as sub_field_name")
      .where(post_id: post_detail_params[:post_current_id])

    @posts.each do |post|
      tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      # タグ名をTagモデルのインスタンスに変換してtags属性に代入
      post.tags = tag_names.map { |tag_name| Tag.find_or_initialize_by(tag_name: tag_name) }
    end

    render json: { status: 200, posts: @posts.as_json(include: [:tags])}



  end

  private

    def post_detail_params
    params.permit(:post_current_id)
  end
end
