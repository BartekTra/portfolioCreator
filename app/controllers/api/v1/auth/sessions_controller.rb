# app/controllers/api/v1/auth/sessions_controller.rb
module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        # POST /api/v1/auth/sign_in
        def create
          user = ::User.find_by(email: params[:email])

          if user && user.valid_password?(params[:password])
            # Sprawdź, czy użytkownik potwierdził email
            unless user.confirmed?
              render json: { 
                status: "error", 
                message: "Musisz potwierdzić swój adres email przed zalogowaniem. Sprawdź swoją skrzynkę pocztową." 
              }, status: :unauthorized
              return
            end

            token = user.create_new_auth_token
            render json: {
              status: "success",
              data: user.as_json(only: [ :id, :email, :first_name, :surname, :nickname ]),
              tokens: token
            }, status: :ok
          else
            render json: { status: "error", message: "Invalid email or password" }, status: :unauthorized
          end
        end

        # DELETE /api/v1/auth/sign_out
        def destroy
          client_id = request.headers["client"]
          token = request.headers["access-token"]

          if current_api_v1_user && client_id && current_api_v1_user.tokens[client_id]
            # Verify token matches
            stored_token = current_api_v1_user.tokens[client_id]
            if stored_token && BCrypt::Password.new(stored_token["token"]) == token
              current_api_v1_user.tokens.delete(client_id)
              current_api_v1_user.save
              render json: { status: "success", message: "Signed out successfully" }, status: :ok
            else
              render json: { status: "error", message: "User not signed in" }, status: :unauthorized
            end
          else
            render json: { status: "error", message: "User not signed in" }, status: :unauthorized
          end
        end
      end
    end
  end
end
