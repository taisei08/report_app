class Api::V1::FieldsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :create, :update]

  def index
    @fields = current_api_v1_user.interests
      .where(user_id: current_api_v1_user.user_id)
      .select(:field_id)
    render json: { status: 200, fields: @fields }
  end

  def create
    # 送信されたデータから interests を取得
    p params
    interests_data = params.require(:form_data)
    p interests_data
    interests_data_objects = interests_data.map { |interest_data| interest_data.permit(:field_id) }
    p interests_data_objects
    @fields = current_api_v1_user.interests.new(interests_data_objects)


      if @fields.all?(&:save)
        render json: { message: "Interests saved successfully" }, status: :ok
      else
        render json: { error: "Failed to save interests" }, status: :unprocessable_entity
      end
  end

  def update
    # 送信されたデータから interests を取得
    @before = current_api_v1_user.interests
    .where(user_id: current_api_v1_user.user_id)
    ActiveRecord::Base.transaction do
      p @before
      if @before.present?
        @before.destroy_all
      end
    
      interests_data = params[:form_data]

      if interests_data.present?
        interests_data_objects = interests_data.map { |interest_data| interest_data.permit(:field_id) }
  
        @fields = current_api_v1_user.interests.new(interests_data_objects)
  
        if @fields.all?(&:save)
          render json: { message: "Interests saved successfully" }, status: :ok
        else
          render json: { error: "Failed to save interests" }, status: :unprocessable_entity
          raise ActiveRecord::Rollback  # ロールバックを行います
        end
      else
        render json: { message: "No interests data provided" }, status: :ok
      end
    end
  end

  private

  def create_params
    params.permit(:field_id)
  end
  
end
