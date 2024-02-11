class Api::V1::PostsEditController < ApplicationController

  def index
    @post = Post      
    .find(post_params[:post_id])
    p "フェイオッjフィオ絵wじょいfw"
    p params

    
      tag_names = SetTag.joins(:tag).where(post_id: @post.post_id).pluck("tags.tag_name")
      # タグ名をTagモデルのインスタンスに変換してtags属性に代入
      @post[:tags] = tag_names
    
    render json: { status: 200, post: @post}
  end

  def update
    @post = Post.find(post_params[:post_id])

    tag_names = post_params[:tags]
    p params
    p post_params[:tags]

    ActiveRecord::Base.transaction do
      if @post.update(update_params)
        existing_tag_names = @post.tags.pluck(:tag_name)
        
        existing_tags = tag_names.map do |tag_info|
          existing_tag = Tag.find_by(tag_name: tag_info)
          existing_tag ||= @post.tags.create(tag_name: tag_info)
          existing_tag
        end
    
        (existing_tag_names - tag_names).each do |tag_name|
          tag = Tag.find_by(tag_name: tag_name)
          if tag
            set_tag = @post.set_tags.find_by(tag_id: tag.tag_id)
            set_tag.destroy if set_tag
          end
        end
    
        Tag.where.not(tag_id: SetTag.select(:tag_id).distinct).destroy_all
    
        render json: { message: 'Post updated successfully' }, status: :ok
      else
        render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
        raise ActiveRecord::Rollback # トランザクションをロールバックする
      end
    end    
  end

  private
  
  def post_params
    params.permit(:post_id, :title, :description, :field_id, :sub_field_id, tags: [])
  end  

  def update_params
    params.permit(:title, :description, :field_id, :sub_field_id)
  end

end
