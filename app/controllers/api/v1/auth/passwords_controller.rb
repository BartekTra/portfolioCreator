module Api
  module V1
    module Auth
      class PasswordsController < DeviseTokenAuth::PasswordsController
        # Pomiń autentykację dla resetowania hasła - użytkownik nie jest zalogowany
        skip_before_action :authenticate_api_v1_user!, only: [:create, :update], raise: false
        skip_before_action :set_user_by_token, only: [:create, :update], raise: false
        
        def create
          # Pobierz email z parametrów (DeviseTokenAuth może zagnieżdżać parametry)
          email_param = params[:email] || params.dig(:password, :email) || params.dig("password", "email")
          return render_create_error unless email_param.present?

          @email = email_param.to_s.downcase.strip
          @resource = ::User.find_by(email: @email)

          if @resource
            yield @resource if block_given?
            
            # Wygeneruj token resetowania hasła używając Devise
            # Devise automatycznie generuje token i zapisuje go w reset_password_token
            raw_token = @resource.send(:set_reset_password_token)
            @resource.save
            
            if raw_token.present?
              # Wyślij email z linkiem resetowania
              redirect_url = params[:redirect_url] || params.dig(:password, :redirect_url) || request.headers["Origin"] || "http://localhost:5173"
              client_url = redirect_url.to_s
              
              UserMailer.password_reset(
                @resource,
                raw_token,
                client_url
              ).deliver_now

              render_create_success
            else
              render_create_error
            end
          else
            render_create_error
          end
        end

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

        def update
          # Pobierz parametry
          reset_token = params[:reset_password_token] || params.dig(:password, :reset_password_token)
          email_param = params[:email] || params.dig(:password, :email)
          password = params[:password] || params.dig(:password, :password)
          password_confirmation = params[:password_confirmation] || params.dig(:password, :password_confirmation)

          return render_update_error_missing_params unless reset_token.present? && email_param.present? && password.present?

          @email = email_param.to_s.downcase.strip
          @resource = ::User.find_by(email: @email)

          return render_update_error_user_not_found unless @resource

          # Weryfikuj token resetowania hasła używając Devise.token_generator
          # Devise przechowuje zahashowany token w bazie, więc musimy porównać zahashowany token z tym w bazie
          if @resource.reset_password_token.present?
            # Oblicz hash tokena z parametrów
            token_digest = Devise.token_generator.digest(::User, :reset_password_token, reset_token)
            
            # Porównaj z tokenem w bazie danych
            if Devise.secure_compare(@resource.reset_password_token, token_digest)
              # Sprawdź czy token nie wygasł (domyślnie 6 godzin w Devise)
              if @resource.reset_password_sent_at.present? && @resource.reset_password_sent_at > 6.hours.ago
                # Resetuj hasło
                @resource.password = password
                @resource.password_confirmation = password_confirmation
                
                if @resource.save
                  # Wyczyść token resetowania hasła
                  @resource.reset_password_token = nil
                  @resource.reset_password_sent_at = nil
                  @resource.save(validate: false)
                  
                  render_update_success
                else
                  render_update_error
                end
              else
                render json: {
                  status: "error",
                  errors: ["Token resetowania hasła wygasł. Proszę poprosić o nowy link."]
                }, status: :unprocessable_entity
              end
            else
              render json: {
                status: "error",
                errors: ["Nieprawidłowy token resetowania hasła."]
              }, status: :unprocessable_entity
            end
          else
            render json: {
              status: "error",
              errors: ["Brak tokena resetowania hasła dla tego użytkownika."]
            }, status: :unprocessable_entity
          end
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

        def render_update_error_missing_params
          render json: {
            status: "error",
            errors: ["Brakuje wymaganych parametrów."]
          }, status: :unprocessable_entity
        end

        def render_update_error_user_not_found
          render json: {
            status: "error",
            errors: ["Nie znaleziono użytkownika z podanym adresem email."]
          }, status: :not_found
        end

        private

        def resource_errors
          @resource.errors.full_messages
        end
      end
    end
  end
end
