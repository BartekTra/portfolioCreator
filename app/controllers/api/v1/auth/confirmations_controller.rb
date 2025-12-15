module Api
  module V1
    module Auth
      class ConfirmationsController < DeviseTokenAuth::ConfirmationsController
        def show
          @resource = resource_class.confirm_by_token(params[:confirmation_token])
          
          if @resource.errors.empty?
            # Jeśli jest redirect_url, przekieruj tam
            redirect_url = params[:redirect_url] || ENV.fetch("FRONTEND_URL", "http://localhost:5173")
            
            # Waliduj i przekieruj
            begin
              uri = URI.parse(redirect_url.to_s)
              if uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
                redirect_to redirect_url, allow_other_host: true
              else
                render json: {
                  status: "success",
                  message: "Email został pomyślnie potwierdzony."
                }
              end
            rescue URI::InvalidURIError
              render json: {
                status: "success",
                message: "Email został pomyślnie potwierdzony."
              }
            end
          else
            render json: {
              status: "error",
              errors: @resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
