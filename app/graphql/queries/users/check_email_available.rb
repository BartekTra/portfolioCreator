module Queries
  module Users
    class CheckEmailAvailable < Queries::BaseQuery
      type Boolean, null: false

      argument :email, String, required: true

      def resolve(email:)
        if ::User.exists?(email: email)
          false
        else
          true
        end
      end
    end
  end
end
