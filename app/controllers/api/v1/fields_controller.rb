class Api::V1::FieldsController < ApplicationController

    def index
        @fields = Field.select(:field_id, :field_name)
        p @fields
        render json: { status: 200, fields: @fields }
      end
end
