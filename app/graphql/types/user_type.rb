
module Types
    class UserType < Types::BaseObject
      field :id, ID, null: false
      field :email, String, null: false
      field :provider, String, null: false
      field :uid, String, null: false
      field :first_name, String, null: true
      field :surname, String, null: true
      field :nickname, String, null: true
      field :confirmed_at, GraphQL::Types::ISO8601DateTime, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
      field :image_url, String, null: true
      def image_url
        Rails.application.routes.url_helpers.url_for(object.image) if object.image.attached?
      end
    end
end
