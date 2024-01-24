class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def render_create_error
    render json: { errors: @resource.errors.full_messages }, status: :unprocessable_entity
  end
  private

    def sign_up_params
      puts self.headers
      params.permit(:email, :password, :password_confirmation, :user_name, :icon_path, 
                    :account_name, :gender, :birthday, :school, :fuculty_department)
    end
end