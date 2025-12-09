# app/controllers/api/v1/repositories_controller.rb
module Api
  module V1
    class RepositoriesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_repository, only: [:show, :update, :destroy]

      # GET /api/v1/repositories
      def index
        @repositories = current_api_v1_user.repositories.order(created_at: :desc)
        render json: @repositories.map { |repo| repository_json(repo) }
      end

      # GET /api/v1/repositories/:id
      def show
        render json: repository_json(@repository)
      end

      # POST /api/v1/repositories
      def create
        @repository = current_api_v1_user.repositories.build(repository_params)

        if @repository.save
          # Dodaj projekty jeśli zostały przekazane
          add_projects_to_repository if params[:project_ids].present?
          
          render json: repository_json(@repository), status: :created
        else
          render json: { errors: @repository.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/repositories/:id
      def update
        if @repository.update(repository_params)
          # Aktualizuj projekty jeśli zostały przekazane
          update_repository_projects if params[:project_ids].present?
          
          render json: repository_json(@repository)
        else
          render json: { errors: @repository.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/repositories/:id
      def destroy
        @repository.destroy
        head :no_content
      end

      private

      def set_repository
        @repository = current_api_v1_user.repositories.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Repository not found" }, status: :not_found
      end

      def repository_params
        params.require(:repository).permit(:name, :description)
      end

      def parse_project_ids
        return [] unless params[:project_ids].present?
        
        if params[:project_ids].is_a?(Array)
          params[:project_ids].map(&:to_i)
        elsif params[:project_ids].is_a?(String)
          params[:project_ids].split(",").map(&:to_i)
        else
          []
        end
      end

      def add_projects_to_repository
        project_ids = parse_project_ids
        
        project_ids.each_with_index do |project_id, index|
          project = current_api_v1_user.projects.find_by(id: project_id)
          next unless project
          
          @repository.repository_projects.create(
            project: project,
            position: index
          ) unless @repository.projects.include?(project)
        end
      end

      def update_repository_projects
        # Usuń wszystkie istniejące powiązania
        @repository.repository_projects.destroy_all
        
        # Dodaj nowe projekty w określonej kolejności
        project_ids = parse_project_ids
        
        project_ids.each_with_index do |project_id, index|
          project = current_api_v1_user.projects.find_by(id: project_id)
          next unless project
          
          @repository.repository_projects.create(
            project: project,
            position: index
          )
        end
      end

      def repository_json(repository)
        {
          id: repository.id,
          name: repository.name,
          description: repository.description,
          user_id: repository.user_id,
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

