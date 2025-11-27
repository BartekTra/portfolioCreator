# app/controllers/api/v1/projects_controller.rb
module Api
  module V1
    class ProjectsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_project, only: [ :show, :update, :destroy ]

      # GET /api/v1/projects
      def index
        @projects = current_api_v1_user.projects.order(created_at: :desc)
        render json: @projects.map { |project| project_json(project) }
      end

      # GET /api/v1/projects/:id
      def show
        render json: project_json(@project)
      end

      # POST /api/v1/projects
      def create
        # Parse JSON data
        project_data = parse_project_data(params[:data])
        template_key = resolve_template_key

        unless valid_template_key?(template_key)
          render json: { error: "Niepoprawny template" }, status: :unprocessable_entity
          return
        end

        project_data["template_key"] = template_key

        # Walidacja podstawowa
        unless valid_project_data?(project_data)
          render json: {
            error: "Projekt musi zawierac tytul"
          }, status: :unprocessable_entity
          return
        end

        # Utwórz projekt dla zalogowanego użytkownika
        @project = current_api_v1_user.projects.build(data: project_data, template_key: template_key)

        # KLUCZOWA ZMIANA: Najpierw zapisz projekt, POTEM dodaj zdjęcia
        if @project.save
          # Teraz projekt istnieje w bazie i możemy dodać zdjęcia
          attach_images_with_metadata(project_data) if params[:images].present?

          # Przeładuj projekt żeby mieć aktualne zdjęcia
          @project.reload

          render json: project_json(@project), status: :created
        else
          render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/projects/:id
      def update
        project_data = parse_project_data(params[:data])
        template_key = resolve_template_key || @project.template_key

        unless valid_template_key?(template_key)
          render json: { error: "Niepoprawny template" }, status: :unprocessable_entity
          return
        end

        project_data["template_key"] = template_key

        unless valid_project_data?(project_data)
          render json: {
            error: "Projekt musi zawierac tytul"
          }, status: :unprocessable_entity
          return
        end

        if @project.update(data: project_data, template_key: template_key)
          # Dodaj nowe zdjęcia (nie usuwaj starych)
          attach_images_with_metadata(project_data) if params[:images].present?

          # Przeładuj projekt żeby mieć aktualne zdjęcia
          @project.reload

          render json: project_json(@project)
        else
          render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/projects/:id
      def destroy
        @project.destroy
        head :no_content
      end

      private

      def set_project
        # Znajdź projekt TYLKO jeśli należy do zalogowanego użytkownika
        @project = current_api_v1_user.projects.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Project not found" }, status: :not_found
      end

      def parse_project_data(data_param)
        return {} unless data_param.present?

        if data_param.is_a?(String)
          begin
            JSON.parse(data_param)
          rescue JSON::ParserError => e
            Rails.logger.error("JSON Parse Error: #{e.message}")
            {}
          end
        else
          data_param
        end
      end

      def valid_project_data?(data)
        return false unless data.is_a?(Hash)
        return false unless data["sections"].is_a?(Array)

        # Sprawdź czy jest przynajmniej jedna sekcja z tytułem
        data["sections"].any? { |s| s["type"] == "title" && s["value"].present? }
      end

      def attach_images_with_metadata(project_data)
        images_param = params[:images]
        return unless images_param.present?

        # Konwertuj ActionController::Parameters na zwykły Hash
        images_hash = images_param.to_unsafe_h

        # Obsługa hash z kluczami w formacie: "SECTION_ID_FILE_INDEX"
        images_hash.each do |key, file|
          next unless file.present?

          Rails.logger.info "  Processing image: #{key} -> #{file.original_filename}"

          # Parse klucza: "1763073875932_0" -> section_id: 1763073875932, file_index: 0
          section_id, file_index = key.to_s.split("_").map(&:to_i)

          # Znajdź sekcję w danych projektu
          section = project_data["sections"].find { |s| s["id"] == section_id }

          # Attach z metadaną
          @project.images.attach(
            io: file.tempfile,
            filename: file.original_filename,
            content_type: file.content_type,
            metadata: {
              section_id: section_id,
              file_index: file_index,
              section_order: section ? section["order"] : 0,
              section_type: section ? section["type"] : "unknown"
            }
          )
        end
      end

      def project_json(project)
        images_data = if project.images.attached?
          project.images.map do |img|
            {
              url: rails_blob_url(img, host: request.base_url),
              section_id: img.metadata[:section_id],
              file_index: img.metadata[:file_index],
              section_order: img.metadata[:section_order],
              section_type: img.metadata[:section_type],
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

      def resolve_template_key
        key = params[:template_key]
        key = key.presence || params.dig(:project, :template_key)
        key.presence
      end

      def valid_template_key?(key)
        key.present? && Project::TEMPLATE_KEYS.include?(key)
      end
    end
  end
end
