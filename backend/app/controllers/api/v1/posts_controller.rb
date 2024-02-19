class Api::V1::PostsController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:create, :destroy]

  def index
    @posts = Post.joins(:user)      
    .select("users.user_name", "users.icon_path", "posts.*")
    .order("created_at DESC")
    .page(params[:page])
    .per(10)

    @posts.each do |post|
      post.icon_path = post.user.icon_path.url
      post[:tags] = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
      post[:average_rating] = post.ratings.average(:value)
    end

    render json: { status: 200, posts: @posts}
  end

  def create
    @post = current_api_v1_user.posts.new(post_params)
    tag_names = JSON.parse(params[:tags])
  
    @post.transaction do

      if @post.save
        newly_created_post_id = @post.reload.post_id
        existing_tags = tag_names.map do |tag_info|
          existing_tag = Tag.find_by(tag_name: tag_info)
          if existing_tag
            @post.set_tags.create(tag_id: existing_tag.tag_id)
          else
            @post.tags.create(tag_name: tag_info)
          end
        end
  
        render json: { status: 'success', message: 'Post created successfully', post_id: newly_created_post_id }
      else
        render json: { status: 'error', message: @post.errors.full_messages.join(', ') }
      end
      
    rescue => e
      logger.error "An error occurred while creating post: #{e.message}"
      render json: { status: 'error', message: 'An error occurred while creating post' }
    end
  end  

  def destroy
    @post = current_api_v1_user.posts
    .find(destroy_params[:id])

    if @post.user_id != current_api_v1_user.user_id
      render json: { error: 'Unauthorized access to post' }, status: :unauthorized
      return
    end

    if @post.destroy
      Tag.where.not(tag_id: SetTag.select(:tag_id).distinct).destroy_all
      render json: { message: 'Post deleted' }, status: :ok
    else
      render json: { error: 'Failed to delete post' }, status: :unprocessable_entity
    end
  end

  private


  def post_params
    params.permit(:user_id, :title, :description, :document_path, :document_type,
    :field_id, :sub_field_id)
  end

  def destroy_params
    params.permit(:id)
  end

end