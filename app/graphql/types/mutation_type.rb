# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    #User dedicated mutations fields
    field :register_user, mutation: Mutations::Users::RegisterUser
    field :login_user, mutation: Mutations::Users::LoginUser
  end
end
