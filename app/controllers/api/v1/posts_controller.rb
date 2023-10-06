class Api::V1::PostsController < ApplicationController
    # app/controllers/posts_controller.rb
    before_action :set_post, only: [:show, :edit, :update, :destroy]
  
    def index
      @posts = Post.select(:post_id, :title, :description, :created_at,
      :updated_at).order("created_at DESC").page(params[:page])
      p @posts
      render json: { status: 200, posts: @posts}

    end
  
    def show
    end
  
    def new
      @post = Post.new
    end
  
    def create
      @post = Post.new(post_params)
  
      if @post.save
        redirect_to @post, notice: 'Post was successfully created.'
      else
        render :new
      end
    end
  
    def edit
    end
  
    def update
      if @post.update(post_params)
        redirect_to @post, notice: 'Post was successfully updated.'
      else
        render :edit
      end
    end
  
    def destroy
      @post.destroy
      redirect_to posts_url, notice: 'Post was successfully destroyed.'
    end
  
    private
  
    def set_post
      @post = Post.find(params[:id])
    end
  
    def post_params
      params.require(:post).permit(:user_id, :title, :description, :field_id, :sub_field_id, :document_type, :document_path)
    end
  end
