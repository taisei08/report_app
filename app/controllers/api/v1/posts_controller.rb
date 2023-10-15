class Api::V1::PostsController < ApplicationController
    # app/controllers/posts_controller.rb
    before_action :set_post, only: [:show, :edit, :update, :destroy]
    before_action :authenticate_api_v1_user!, only: [:create]

  
    def index
      @posts = Post.joins(:user, :tags)      
      .select("users.user_name", "posts.*")
      .order("created_at DESC")
      .page(params[:page])
      .per(2)

      @posts = Post.joins(:user, :tags)      
      .select("users.user_name", "posts.*")
      .order("created_at DESC")
      .page(params[:page])
      .per(2)

      @posts.each do |post|
        tag_names = SetTag.joins(:tag).where(post_id: post.post_id).pluck("tags.tag_name")
        # タグ名をTagモデルのインスタンスに変換してtags属性に代入
        post.tags = tag_names.map { |tag_name| Tag.find_or_initialize_by(tag_name: tag_name) }
      end

      render json: { status: 200, posts: @posts.as_json(include: :tags)}



    end
  
    def show
    end
  
    def new
      @post = Post.new
    end
  
    def create
        @post = current_api_v1_user.posts.new(post_params)
        @post.document_type = assign_document_type(params[:document_path].content_type)

        tag_names = JSON.parse(params[:tag_name])


        @post.transaction do
            if @post.save
              tag_names.each do |tag|
                puts tag_name: tag["tag_name"]
                existing_tag = Tag.find_by(tag_name: tag["tag_name"])
                puts "見てみて！"
                p existing_tag
                if existing_tag
                  # 既に存在する場合はそれを使用
                  tag_to_use = existing_tag
                  @post.set_tags.create(tag:tag_to_use)
                else
                  # 存在しない場合は新しく作成
                  tag_to_use = @post.tags.create(tag_name: tag["tag_name"])
                end
          
              end
              render json: { status: 'success', message: 'Post created successfully' }
            else
              render json: { status: 'error', message: @post.errors.full_messages.join(', ') }
            end
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
        params.permit(:user_id, :title, :description, :document_path, :document_type,
        :field_id, :sub_field_id)
    end

    def assign_document_type(content_type)
        case content_type
        when 'application/pdf'
          1
        when 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          2
        else
          nil # 未知のファイルタイプの場合は適切な処理を行うか、エラーとして扱う
        end
    end
    

end