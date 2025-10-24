module Mutations
    module Users
        class RegisterUser < Mutations::BaseMutation
            argument :email, String, required: true
            argument :password, String, required: true
            argument :password_confirmation, String, required: true
            argument :first_name, String, required: true
            argument :surname, String, required: true

            field :errors, [ String ], null: false
            
            def resolve(email:, password:, password_confirmation:, first_name:, surname:)
                user = User.new(
                email: email,
                password: password,
                password_confirmation: password_confirmation,
                first_name: first_name,
                surname: surname
                )

                if user.save
                { user: user, errors: [] }
                else
                { user: nil, errors: user.errors.full_messages }
                end
            end
        end
    end
end
