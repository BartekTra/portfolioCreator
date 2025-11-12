module Api
  module V1
    class ProjectsController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_project, only: [:show, :update, :destroy]

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
        @project = current_api_v1_user.projects.build(project_params)

        if @project.save
          attach_images if params[:images].present?
          render json: project_json(@project), status: :created
        else
          render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/projects/:id
      def update
        if @project.update(project_params)
          attach_images if params[:images].present?
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
        @project = current_api_v1_user.projects.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Project not found" }, status: :not_found
      end

      def project_params
        data = params[:data]
        # Jeśli data jest stringiem JSON, sparsuj go
        if data.is_a?(String)
          begin
            data = JSON.parse(data)
          rescue JSON::ParserError
            # Jeśli nie jest poprawnym JSON, zwróć jako string
          end
        end
        { data: data }
      end

      def attach_images
        images_param = params[:images]
        # Obsługa różnych formatów: tablica, hash lub pojedynczy plik
        if images_param.is_a?(Array)
          images_param.each do |image|
            @project.images.attach(image) if image.present?
          end
        elsif images_param.is_a?(Hash)
          images_param.each do |_key, image|
            @project.images.attach(image) if image.present?
          end
        elsif images_param.present?
          @project.images.attach(images_param)
        end
      end

      def project_json(project)
        image_urls = if project.images.attached?
          project.images.map { |img| url_for(img) }
        else
          []
        end

        {
          id: project.id,
          data: project.data,
          user_id: project.user_id,
          images: image_urls,
          created_at: project.created_at,
          updated_at: project.updated_at
        }
      end
    end
  end
end

