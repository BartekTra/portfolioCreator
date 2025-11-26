module Api
  module V1
    module User
      class CheckEmailAvailabilityController < ApplicationController
        def show
          if ::User.exists?(email: params[:email])
            render json: {
              status: "error",
              available: false,
              message: "Email is already taken"
            }, status: :unprocessable_entity
          else
            render json: {
              status: "success",
              available: true,
              message: "Email is available"
            }, status: :ok
          end
        end
      end
    end
  end
end
