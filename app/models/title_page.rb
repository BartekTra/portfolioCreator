# app/models/title_page.rb
class TitlePage < ApplicationRecord
  TEMPLATE_KEYS = %w[
    titleTemplate1 titleTemplate2 titleTemplate3
  ].freeze

  # Relacja z użytkownikiem
  belongs_to :user
  
  # Relacja z repozytorium (opcjonalna, bo może być używana przez wiele)
  has_one :repository, dependent: :nullify

  # ActiveStorage dla zdjęcia profilowego
  has_one_attached :photo

  # Walidacje
  validates :user, presence: true
  validates :template_key, presence: true, inclusion: { in: TEMPLATE_KEYS }
  validate :validate_photo_size

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  private

  def validate_photo_size
    return unless photo.attached?

    if photo.byte_size > 5.megabytes
      errors.add(:photo, "is too large (max 5MB)")
    end

    unless photo.content_type.start_with?("image/")
      errors.add(:photo, "is not a valid image")
    end
  end
end

