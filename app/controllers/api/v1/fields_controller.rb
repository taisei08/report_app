class Api::V1::FieldsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:create, :update]

  def index
      @fields = Field.select(:field_id, :field_name)
      p @fields
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

  private

  def create_params
    params.permit(:field_id)
  end
  
end
