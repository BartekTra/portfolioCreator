# app/models/project.rb
class Project < ApplicationRecord
  TEMPLATE_KEYS = %w[
    templateA templateB templateC templateD templateE templateF
    templateG templateH templateI templateJ templateK templateL templateM
  ].freeze

  # Relacja z użytkownikiem
  belongs_to :user

  # ActiveStorage dla wielu zdjęć
  has_many_attached :images

  # Walidacje
  validates :data, presence: true
  validates :user, presence: true
  validates :template_key, presence: true, inclusion: { in: TEMPLATE_KEYS }
  validate :validate_data_structure
  validate :validate_images_size

  # Scopey
  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  private

  def validate_data_structure
    return unless data.present?

    unless data.is_a?(Hash)
      errors.add(:data, "must be a valid JSON object")
      return
    end

    unless data["sections"].is_a?(Array)
      errors.add(:data, "must have sections array")
      return
    end

    # Sprawdź czy jest przynajmniej jedna sekcja z tytułem
    has_title = data["sections"].any? do |section|
      section["type"] == "title" && section["value"].present?
    end

    unless has_title
      errors.add(:data, "must have at least one title section with value")
    end

    if data["template_key"].present? && template_key.present? && data["template_key"] != template_key
      errors.add(:data, "template_key must match project template")
    end

    # Walidacja struktury każdej sekcji
    data["sections"].each_with_index do |section, index|
      unless section["id"].present? && section["type"].present?
        errors.add(:data, "section at index #{index} must have id and type")
      end

      unless section["order"].is_a?(Integer)
        errors.add(:data, "section at index #{index} must have numeric order")
      end
    end
  end

  def validate_images_size
    return unless images.attached?

    # Max 10 zdjęć
    if images.count > 10
      errors.add(:images, "can't have more than 10 images")
    end

    # Max 5MB per image
    images.each do |image|
      if image.byte_size > 5.megabytes
        errors.add(:images, "#{image.filename} is too large (max 5MB)")
      end

      # Tylko obrazy
      unless image.content_type.start_with?("image/")
        errors.add(:images, "#{image.filename} is not a valid image")
      end
    end
  end
end

