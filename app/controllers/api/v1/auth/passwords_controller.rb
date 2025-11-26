module Api
  module V1
    module Auth
      class PasswordsController < DeviseTokenAuth::PasswordsController
        def render_create_success
          render json: {
            status: "success",
            message: "Instrukcje resetowania hasła zostały wysłane na Twój adres email."
          }
        end

        def render_create_error
          render json: {
            status: "error",
            errors: [ "Nie znaleziono użytkownika z podanym adresem email." ]
          }, status: :not_found
        end

        def render_update_success
          render json: {
            status: "success",
            message: "Hasło zostało pomyślnie zmienione."
          }
        end

        def render_update_error
          render json: {
            status: "error",
            errors: resource_errors
          }, status: :unprocessable_entity
        end

        private

        def resource_errors
          @resource.errors.full_messages
        end
      end
    end
  end
end
