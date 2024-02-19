class Api::V1::FieldsController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index, :update]

  def index
    @fields = current_api_v1_user.interests
      .where(user_id: current_api_v1_user.user_id)
      .select(:field_id)
    render json: { status: 200, fields: @fields }
  end

  def update
    @before = current_api_v1_user.interests.where(user_id: current_api_v1_user.user_id)
  
    ActiveRecord::Base.transaction do
      @before.destroy_all if @before.present?

      if field_id_params[:field_id].present?
        interests_data = params.require(:field_id)
      else
        interests_data = nil
      end

      if interests_data.present?
        interests_data_objects = interests_data.map { |interest_data| interest_data.permit(:field_id) }
        @fields = current_api_v1_user.interests.new(interests_data_objects)

        @fields.each do |field|
          unless field.save
            Rails.logger.error "Failed to save record with errors: #{field.errors.full_messages}"
          end
        end
        
        if @fields.all?(&:save)
          render json: { message: "update success" }, status: :ok
        else
          render json: { error: "update failed" }, status: :unprocessable_entity
          raise ActiveRecord::Rollback
        end
      else
        render json: { message: "data not provided" }, status: :ok
      end
    end
  end

  private

  def field_id_params
    params.require(:field)
  end

end
