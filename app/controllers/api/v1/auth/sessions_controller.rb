class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController

  protected
  
  def render_create_success
    if @resource.sign_in_count == 1
      cookies[:first_session] = { value: true, expires: 10.minutes }
      render json: {
        data: resource_data(resource_json: @resource.token_validation_response),
        cookies: cookies.to_h
      }
    else
      render json: {
        data: resource_data(resource_json: @resource.token_validation_response)
      }
    end

  end

end