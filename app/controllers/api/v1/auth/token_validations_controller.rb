module Api
  module V1
    module Auth
      class TokenValidationsController < DeviseTokenAuth::TokenValidationsController
        before_action :authenticate_api_v1_user!

        def create
          if @resource
            render json: {
              status: "success",
              data: {
                user: @resource.as_json(except: [ :tokens, :encrypted_password ]),
                token: {
                  'access-token': response.headers["access-token"],
                  client: response.headers["client"],
                  uid: response.headers["uid"],
                  expiry: response.headers["expiry"]
                }
              },
              message: "Token jest prawidłowy."
            }
          else
            render json: {
              status: "error",
              errors: [ "Token jest nieprawidłowy lub wygasł." ]
            }, status: :unauthorized
          end
        end
      end
    end
  end
end
