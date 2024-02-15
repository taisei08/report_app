class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController

  before_action :authenticate_api_v1_user!, only: [:update, :destroy]

  def update
    @redirect_url = params.fetch(
      :confirm_success_url,
      DeviseTokenAuth.default_confirm_success_url
    )

    user = User.find_by(email: params[:email])

    if user && user != current_api_v1_user
      render json: { error: "The email address is already registered by another user." }, status: :unprocessable_entity
      return
    end

    if current_api_v1_user.update(unconfirmed_email: params[:email])
      current_api_v1_user.send_confirmation_instructions({
        client_config: params[:email],
        redirect_url: @redirect_url
      })
      render json: { message: "Confirmation email sent to #{params[:email]}" }, status: :ok
    else
      render json: { error: current_api_v1_user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    p destroy_params[:password]
    if @resource && current_api_v1_user.valid_password?(destroy_params[:password])
      @resource.destroy
      yield @resource if block_given?
      render_destroy_success
    else
      render status: :not_found, json: { message: 'パスワードが間違っています。' }
    end
  end

  def render_create_error
    render json: { errors: @resource.errors.full_messages }, status: :unprocessable_entity
  end

  private

    def sign_up_params
      puts self.headers
      params.permit(:email, :password, :password_confirmation, :user_name, :icon_path, 
                    :account_name, :gender, :birthday, :school, :fuculty_department)
    end

    def destroy_params
      params.permit(:password)
    end
end