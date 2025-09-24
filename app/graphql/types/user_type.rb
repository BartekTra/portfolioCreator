
module Types
    class UserType < Types::BaseObject
      field :id, ID, null: false
      field :email, String, null: false
      field :provider, String, null: false
      field :uid, String, null: false
      field :name, String, null: true
      field :nickname, String, null: true
      field :image, String, null: true
      field :confirmed_at, GraphQL::Types::ISO8601DateTime, null: true
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
end