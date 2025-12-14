# app/models/repository.rb
class Repository < ApplicationRecord
  belongs_to :user
  belongs_to :title_page, optional: false
  has_many :repository_projects, dependent: :destroy
  has_many :projects, through: :repository_projects

  # Walidacje
  validates :name, presence: true
  validates :user, presence: true
  validates :title_page, presence: true

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }

  # Metody pomocnicze
  def projects_ordered
    projects.order("repository_projects.position ASC")
  end

  def project_count
    projects.count
  end

  # Generuje unikalny token do udostępniania portfolio
  def generate_share_token!
    loop do
      self.public_share_token = SecureRandom.urlsafe_base64(32)
      break unless Repository.exists?(public_share_token: public_share_token)
    end
    save!
    public_share_token
  end
end

