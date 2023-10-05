class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

    def sign_up_params
      puts self.headers
      params.permit(:email, :password, :password_confirmation, :user_name, :icon_path, 
                    :gender, :birthday, :school, :fuculty_department)
    end
end