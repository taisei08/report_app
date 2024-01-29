class Api::V1::UsersIndexForHeaderController < ApplicationController

  before_action :authenticate_api_v1_user!, only: [:index]

  def index
    user_data = current_api_v1_user.slice(:user_id,:user_name,
    :account_name, :profile_statement, :icon_path, :school,
    :faculty_department, :birthday)
    render json: user_data
  end

end