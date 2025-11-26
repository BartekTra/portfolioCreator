# app/controllers/api/v1/auth/sessions_controller.rb
module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        # POST /api/v1/auth/sign_in
        def create
          user = ::User.find_by(email: params[:email])

          if user && user.valid_password?(params[:password])
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

          if current_user && current_user.tokens[client_id] && DeviseTokenAuth::TokenFactory.valid?(token)
            current_user.tokens.delete(client_id)
            current_user.save
            render json: { status: "success", message: "Signed out successfully" }, status: :ok
          else
            render json: { status: "error", message: "User not signed in" }, status: :unauthorized
          end
        end
      end
    end
  end
end
