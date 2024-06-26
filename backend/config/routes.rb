Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :fields, only: %i[index create]
      put '/fields', to: 'fields#update'
      resources :following, only: %i[index]
      resources :followed, only: %i[index]
      resources :follows, only: %i[index create destroy]
      resources :follow_and_post_counts, only: %i[index]
      resources :health_check, only: %i[index]
      resources :like_post_counts, only: %i[index]
      resources :like_posts, only: %i[index]
      resources :likes, only: %i[index create destroy]
      resources :like_counts, only: %i[index]
      resources :notifications, only: %i[index]
      resources :notifications_checked, only: %i[index]
      resources :posts, only: %i[index create destroy]
      resources :post_detail, only: %i[index]
      resources :posts_of_field, only: %i[index]
      resources :posts_by_user, only: %i[index]
      resources :post_counts, only: %i[index]
      resources :posts_edit, only: %i[index update]
      put '/posts_edit', to: 'posts_edit#update', as: 'update'
      resources :posts_search, only: %i[index]
      resources :posts_search_counts, only: %i[index]
      resources :ratings, only: %i[index create]
      resources :rating_of_users, only: %i[index]
      resources :rating_of_users_counts, only: %i[index]
      resources :review_or_reply_spotted, only: %i[index]
      resources :reviews, only: %i[index create update destroy]
      resources :reviews_by_user, only: %i[index]
      resources :review_counts, only: %i[index]
      resources :review_of_post_counts, only: %i[index]
      resources :replies, only: %i[index create update destroy]
      resources :reply_counts, only: %i[index]
      resources :users, only: %i[index update]
      resources :users_index_for_header, only: %i[index]
      
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations',
        sessions: 'api/v1/auth/sessions',
        passwords: 'api/v1/auth/passwords',
        confirmations: 'api/v1/auth/confirmations',
      }

      mount LetterOpenerWeb::Engine, at: "letter_opener" if Rails.env.development?

      namespace :auth do
        resources :current_user, only: %i[index]
      end
    end
  end
end