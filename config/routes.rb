Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "/user/check_email_availability", to: "user/check_email_availability#show"
      get "/user/current_user", to: "user/current_user#show"
      resources :projects, only: [ :index, :show, :create, :update, :destroy ]
      resources :repositories, only: [ :index, :show, :create, :update, :destroy ] do
        member do
          post :generate_share_token
        end
      end
      resources :title_pages, only: [ :index, :show, :create, :update, :destroy ]
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        registrations: "api/v1/auth/registrations",
        sessions: "api/v1/auth/sessions",
        passwords: "api/v1/auth/passwords",
        confirmations: "api/v1/auth/confirmations"
      }
      get "projects/:id/images", to: "projects#images"
      delete "projects/:id/images/:image_id", to: "projects#destroy_image"
      
      # Publiczne endpointy (bez autoryzacji)
      namespace :public do
        get "repositories/:token", to: "repositories#show"
        get "projects/:id", to: "projects#show"
      end
    end
  end
end
