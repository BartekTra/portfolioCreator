module Mutations
    module Users
        class LoginUser < Mutations::BaseMutation
            argument :email, String, required: true
            argument :password, String, required: true

            field :token, String, null: true
            field :errors, [ String ], null: false

            def resolve(email:, password:)
                user = User.find_by(email: email)

                if user&.valid_password?(password)
                token = user.create_new_auth_token
                { token: token.to_json, errors: [] }
                else
                { token: nil, errors: [ "Invalid credentials" ] }
                end
            end
        end
    end
end
