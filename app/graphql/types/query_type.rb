# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # User dedicated queries
    field :current_user, resolver: Queries::Users::CurrentUser
  end
end
