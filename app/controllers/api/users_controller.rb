class Api::UsersController < ApplicationController
  before_action :set_user, only: [ :upload_image ]

  # PATCH /api/users/:id/upload_image
  def upload_image
    if params[:image].present?
      @user.image.attach(params[:image])
      render json: { message: "Image uploaded successfully", url: url_for(@user.image) }, status: :ok
    else
      render json: { error: "No image provided" }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
