Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "/user/check_email_availability", to: "user/check_email_availability#show"
      get "/user/current_user", to: "user/current_user#show"
      resources :projects, only: [ :index, :show, :create, :update, :destroy ]
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        registrations: "api/v1/auth/registrations",
        sessions: "api/v1/auth/sessions"
      }
      get "projects/:id/images", to: "projects#images"
      delete "projects/:id/images/:image_id", to: "projects#destroy_image"
    end
  end
end
