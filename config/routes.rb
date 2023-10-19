Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :test, only: %i[index]
      resources :fields, only: %i[index]
      resources :posts, only: %i[index create]
      resources :post_detail, only: %i[index]
      resources :ratings, only: %i[index create]
      resources :reviews, only: %i[index create]
      resources :users, only: %i[index update]

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end
    end
  end
end