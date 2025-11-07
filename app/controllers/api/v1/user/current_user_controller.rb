module Api
  module V1
    module User
      class CurrentUserController < ApplicationController
        before_action :authenticate_api_v1_user!
        def show
          render json: current_api_v1_user.as_json.merge(avatar_url: current_api_v1_user.avatar.attached? ? url_for(current_api_v1_user.avatar) : nil)
        end
      end
    end
  end
end
