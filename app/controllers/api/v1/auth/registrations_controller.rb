class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController

  def update
    if @resource
      if @resource.send(resource_update_method, account_update_params)
        @redirect_url = params.fetch(
          :confirm_success_url,
          DeviseTokenAuth.default_confirm_success_url
        )
        p @redirect_url
        @resource.send_confirmation_instructions({
          client_config: params[:config_name],
          redirect_url: @redirect_url
        })
        yield @resource if block_given?
        
        render_update_success
      else
        render_update_error
      end
    else
      render_update_error_user_not_found
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
end