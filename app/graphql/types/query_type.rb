# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # User dedicated queries
    field :current_user, resolver: Queries::Users::CurrentUser
    field :check_email_availability, resolver: Queries::Users::CheckEmailAvailable
  end
end
