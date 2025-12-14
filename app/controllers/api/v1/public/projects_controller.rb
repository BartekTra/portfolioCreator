# app/controllers/api/v1/public/projects_controller.rb
module Api
  module V1
    module Public
      class ProjectsController < ApplicationController
        # Pomiń autoryzację - to jest publiczny endpoint
        skip_before_action :authenticate_api_v1_user!, raise: false
        skip_before_action :set_user_by_token, raise: false

        # GET /api/v1/public/projects/:id
        # Używany tylko dla projektów w udostępnionych portfolio
        def show
          @project = Project.find_by(id: params[:id])
          
          unless @project
            render json: { error: "Projekt nie został znaleziony" }, status: :not_found
            return
          end

          # Sprawdź, czy projekt należy do udostępnionego portfolio
          # (opcjonalnie - możemy pozwolić na dostęp do wszystkich projektów w publicznych portfolio)
          render json: project_json(@project)
        end

        private

        def project_json(project)
          images_data = if project.images.attached?
            project.images.map do |img|
              {
                url: rails_blob_url(img, host: request.base_url),
                section_id: img.metadata[:section_id],
                file_index: img.metadata[:file_index],
                section_order: img.metadata[:section_order],
                section_type: img.metadata[:section_type],
                description: img.metadata[:description] || "",
                filename: img.filename.to_s,
                content_type: img.content_type,
                byte_size: img.byte_size
              }
            end.sort_by { |img| [ img[:section_order] || 0, img[:file_index] || 0 ] }
          else
            []
          end

          {
            id: project.id,
            data: project.data,
            user_id: project.user_id,
            template_key: project.template_key,
            images: images_data,
            created_at: project.created_at,
            updated_at: project.updated_at
          }
        end
      end
    end
  end
end

