module Api
  module V1
    module Auth
      class RegistrationsController < DeviseTokenAuth::RegistrationsController
        # POST /api/v1/auth
        def create
          user = ::User.new(sign_up_params)
          user.uid = user.email
          user.provider = "email"

          if user.save
            # Jeśli przesłano plik, przypnij go do użytkownika
            if params[:avatar].present?
              user.avatar.attach(params[:avatar])
            end

            # Jeśli użytkownik wymaga potwierdzenia emaila i nie jest jeszcze potwierdzony,
            # nie zwracaj tokenu - użytkownik musi najpierw potwierdzić email
            if user.confirmed?
              token = user.create_new_auth_token
              render json: {
                tokens: token,
                status: "success",
                data: user.as_json(
                  only: [:id, :email, :first_name, :surname, :nickname, :created_at]
                ).merge(
                  avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
                )
              }, status: :created
            else
              # Użytkownik został utworzony, ale wymaga potwierdzenia emaila
              render json: {
                status: "success",
                message: "Konto zostało utworzone. Sprawdź swoją skrzynkę email, aby potwierdzić adres.",
                data: {
                  id: user.id,
                  email: user.email,
                  confirmed: false
                }
              }, status: :created
            end
          else
            render json: { status: "error", errors: user.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        # PUT /api/v1/auth
        def update
          user = current_api_v1_user

          # Aktualizuj podstawowe pola
          user_params = account_update_params.except(:avatar)
          if user.update(user_params)
            # Jeśli przesłano nowy avatar, przypnij go
            if params[:avatar].present?
              user.avatar.attach(params[:avatar])
            end

            user.reload

            render json: {
              status: "success",
              data: user.as_json(
                only: [:id, :email, :first_name, :surname, :nickname, :created_at]
              ).merge(
                avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
              )
            }, status: :ok
          else
            render json: {
              status: "error",
              errors: user.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def sign_up_params
          params.permit(:email, :password, :password_confirmation,
                                       :first_name, :surname, :nickname, :avatar)
        end

        def account_update_params
          params.permit(:email, :first_name, :surname, :nickname, :avatar)
        end
      end
    end
  end
end
