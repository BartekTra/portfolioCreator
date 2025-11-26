module Api
  module V1
    module Auth
      class ConfirmationsController < DeviseTokenAuth::ConfirmationsController
        def show
          super do |resource|
            if resource.errors.empty?
              render json: {
                status: "success",
                message: "Email został pomyślnie potwierdzony."
              } and return
            else
              render json: {
                status: "error",
                errors: resource.errors.full_messages
              }, status: :unprocessable_entity and return
            end
          end
        end
      end
    end
  end
end
