class Api::V1::PostsController < ApplicationController
    # app/controllers/posts_controller.rb
    before_action :set_post, only: [:show, :edit, :update, :destroy]
    before_action :authenticate_api_v1_user!, only: [:create, :destroy]

    def index
      @posts = Post.joins(:user)      
      .select("users.user_name", "users.icon_path", "posts.*")
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
  
    def create
        @post = current_api_v1_user.posts.new(post_params)

        tag_names = JSON.parse(params[:tags])
        p tag_names

        @post.transaction do
            if @post.save
              tag_names.each do |tag|
                puts tag_name: tag
                existing_tag = Tag.find_by(tag_name: tag)
                puts "見てみて！"
                p existing_tag
                if existing_tag
                  # 既に存在する場合はそれを使用
                  tag_to_use = existing_tag
                  @post.set_tags.create(tag:tag_to_use)
                else
                  # 存在しない場合は新しく作成
                  tag_to_use = @post.tags.create(tag_name: tag)
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
      @post = current_api_v1_user.posts
      .find(destroy_params[:id])
      if @post.destroy
        render json: { message: '投稿が削除されました' }, status: :ok
      else
        render json: { error: '投稿の削除に失敗しました' }, status: :unprocessable_entity
      end
    end
  
    private
  
    def set_post
      @post = Post.find(params[:id])
    end
  
    def post_params
        params.permit(:user_id, :title, :description, :document_path, :document_type,
        :field_id, :sub_field_id)
    end

    def destroy_params
      params.permit(:id)
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