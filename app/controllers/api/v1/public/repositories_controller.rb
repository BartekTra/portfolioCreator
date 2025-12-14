# app/controllers/api/v1/public/repositories_controller.rb
module Api
  module V1
    module Public
      class RepositoriesController < ApplicationController
        # Pomiń autoryzację - to jest publiczny endpoint
        skip_before_action :authenticate_api_v1_user!, raise: false
        skip_before_action :set_user_by_token, raise: false

        # GET /api/v1/public/repositories/:token
        def show
          @repository = Repository.find_by(public_share_token: params[:token])
          
          unless @repository
            render json: { error: "Portfolio nie zostało znalezione" }, status: :not_found
            return
          end

          render json: repository_json(@repository)
        end

        private

        def repository_json(repository)
          title_page_data = if repository.title_page
            {
              id: repository.title_page.id,
              phone: repository.title_page.phone,
              email: repository.title_page.email,
              address: repository.title_page.address,
              bio: repository.title_page.bio,
              experience: repository.title_page.experience || [],
              template_key: repository.title_page.template_key,
              photo_url: repository.title_page.photo.attached? ? 
                rails_blob_url(repository.title_page.photo, host: request.base_url) : nil
            }
          else
            nil
          end

          {
            id: repository.id,
            name: repository.name,
            description: repository.description,
            title_page_id: repository.title_page_id,
            title_page: title_page_data,
            project_ids: repository.projects_ordered.pluck(:id),
            projects: repository.projects_ordered.map do |project|
              {
                id: project.id,
                title: get_project_title(project),
                template_key: project.template_key,
                created_at: project.created_at
              }
            end,
            project_count: repository.project_count,
            created_at: repository.created_at,
            updated_at: repository.updated_at
          }
        end

        def get_project_title(project)
          sections = project.data&.dig("sections") || []
          title_section = sections.find { |s| s["type"] == "title" }
          title_section&.dig("value") || "Bez tytułu"
        end
      end
    end
  end
end

