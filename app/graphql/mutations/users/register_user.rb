module Mutations
    module Users
        class RegisterUser < Mutations::BaseMutation
            argument :email, String, required: true
            argument :password, String, required: true
            argument :password_confirmation, String, required: true
            argument :first_name, String, required: true
            argument :surname, String, required: true
            argument :image, ApolloUploadServer::Upload, required: false

            field :errors, [ String ], null: false
            def resolve(email:, password:, password_confirmation:, first_name:, surname:, image: nil)
                user = User.new(
                email: email,
                password: password,
                password_confirmation: password_confirmation,
                first_name: first_name,
                surname: surname
                )

                # jeśli jest obraz, dołączamy go do Active Storage
                if image
                user.image.attach(
                    io: image.to_io,
                    filename: image.original_filename,
                    content_type: image.content_type
                )
                else
                    default_image_path = Rails.root.join("app/assets/images/default_image.png")
                    user.image_attach(
                        io: File.open(default_image_path),
                        filename: "default-avatar.png",
                        content_type: "image/png"
                    )
                end

                if user.save
                { user: user, errors: [] }
                else
                { user: nil, errors: user.errors.full_messages }
                end
            end
        end
    end
end
