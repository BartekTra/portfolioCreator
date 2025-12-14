# app/controllers/api/v1/title_pages_controller.rb
module Api
  module V1
    class TitlePagesController < ApplicationController
      before_action :authenticate_api_v1_user!
      before_action :set_title_page, only: [:show, :update, :destroy]

      # GET /api/v1/title_pages
      def index
        @title_pages = current_api_v1_user.title_pages.order(created_at: :desc)
        render json: @title_pages.map { |title_page| title_page_json(title_page) }
      end

      # GET /api/v1/title_pages/:id
      def show
        render json: title_page_json(@title_page)
      end

      # POST /api/v1/title_pages
      def create
        template_key = params[:template_key] || "titleTemplate1"

        unless valid_template_key?(template_key)
          render json: { error: "Niepoprawny template" }, status: :unprocessable_entity
          return
        end

        @title_page = current_api_v1_user.title_pages.build(title_page_params.merge(template_key: template_key))

        if @title_page.save
          # Dodaj zdjęcie jeśli zostało przekazane
          attach_photo if params[:photo].present?

          @title_page.reload
          render json: title_page_json(@title_page), status: :created
        else
          render json: { errors: @title_page.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/title_pages/:id
      def update
        template_key = params[:template_key] || @title_page.template_key

        unless valid_template_key?(template_key)
          render json: { error: "Niepoprawny template" }, status: :unprocessable_entity
          return
        end

        if @title_page.update(title_page_params.merge(template_key: template_key))
          # Dodaj nowe zdjęcie jeśli zostało przekazane
          attach_photo if params[:photo].present?

          @title_page.reload
          render json: title_page_json(@title_page)
        else
          render json: { errors: @title_page.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/title_pages/:id
      def destroy
        @title_page.destroy
        head :no_content
      end

      private

      def set_title_page
        @title_page = current_api_v1_user.title_pages.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Title page not found" }, status: :not_found
      end

      def title_page_params
        permitted = params.permit(:phone, :email, :address, :bio, :experience, :sections)
        
        # Parse experience if it's a JSON string
        if permitted[:experience].is_a?(String)
          begin
            parsed_experience = JSON.parse(permitted[:experience])
            permitted[:experience] = parsed_experience.is_a?(Array) ? parsed_experience : []
          rescue JSON::ParserError
            permitted[:experience] = []
          end
        elsif permitted[:experience].nil?
          permitted[:experience] = []
        end

        # Parse sections if it's a JSON string
        if permitted[:sections].is_a?(String)
          begin
            parsed_sections = JSON.parse(permitted[:sections])
            permitted[:sections] = parsed_sections.is_a?(Array) ? parsed_sections : []
          rescue JSON::ParserError
            permitted[:sections] = []
          end
        elsif permitted[:sections].nil?
          permitted[:sections] = []
        end
        
        permitted
      end

      def attach_photo
        return unless params[:photo].present?

        @title_page.photo.attach(
          io: params[:photo].tempfile,
          filename: params[:photo].original_filename,
          content_type: params[:photo].content_type
        )
      end

      def title_page_json(title_page)
        photo_url = if title_page.photo.attached?
          rails_blob_url(title_page.photo, host: request.base_url)
        else
          nil
        end

        {
          id: title_page.id,
          phone: title_page.phone,
          email: title_page.email,
          address: title_page.address,
          bio: title_page.bio,
          experience: title_page.experience || [],
          sections: title_page.sections || [],
          template_key: title_page.template_key,
          photo_url: photo_url,
          user_id: title_page.user_id,
          created_at: title_page.created_at,
          updated_at: title_page.updated_at
        }
      end

      def valid_template_key?(key)
        key.present? && TitlePage::TEMPLATE_KEYS.include?(key)
      end
    end
  end
end

