class Api::V1::PostsEditController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:index, :update]

  def index
    begin
      @post = Post.find(index_params[:post_id])

      if @post.user_id != current_api_v1_user.user_id
        render json: { error: 'Unauthorized access to post' }, status: :unauthorized
        return
      end

      @post[:tags] = SetTag.joins(:tag).where(post_id: @post.post_id).pluck("tags.tag_name")
      render json: { status: 200, post: @post}
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Post not found' }, status: :not_found
    end
  end
  
  def update
    begin
      @post = Post.find(post_params[:post_id])

      if @post.user_id != current_api_v1_user.user_id
        render json: { error: 'Unauthorized access to post' }, status: :unauthorized
        return
      end
  
      ActiveRecord::Base.transaction do
        if @post.update(update_params)
          update_tags
          render json: { message: 'Post updated successfully' }, status: :ok
        else
          render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end
      end

    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Post not found' }, status: :not_found
    end
  end

  private

  def index_params
    params.permit(:post_id)
  end
  
  def post_params
    params.permit(:post_id, :title, :description, :field_id, :sub_field_id, tags: [])
  end  

  def update_params
    params.permit(:title, :description, :field_id, :sub_field_id)
  end

  def update_tags
    tag_names = post_params[:tags]
    p tag_names
    
    existing_tags = tag_names.map do |tag_info|
      existing_tag = @post.tags.find_by(tag_name: tag_info)
    
      if existing_tag
      else
        existing_tag = Tag.find_by(tag_name: tag_info)
        if existing_tag
          @post.set_tags.create(tag_id: existing_tag.tag_id)
        else
          @post.tags.create(tag_name: tag_info)
        end
      end
    end

    existing_tag_names = @post.tags.pluck(:tag_name)
  
    (existing_tag_names - tag_names).each do |tag_name|
      tag = Tag.find_by(tag_name: tag_name)
      if tag
        set_tag = @post.set_tags.find_by(tag_id: tag.tag_id)
        set_tag.destroy if set_tag
      end
    end
  
    Tag.where.not(tag_id: SetTag.select(:tag_id).distinct).destroy_all
  end

end
