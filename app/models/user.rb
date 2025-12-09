# app/models/user.rb
class User < ApplicationRecord
  extend Devise::Models
  include DeviseTokenAuth::Concerns::User
  # Devise modules (jeśli używasz Devise)
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Relacja z projektami
  has_many :projects, dependent: :destroy
  has_many :repositories, dependent: :destroy
  has_one_attached :avatar, dependent: :destroy

  # Walidacje
  validates :email, presence: true, uniqueness: true

  # Metody pomocnicze
  def project_count
    projects.count
  end

  def recent_projects(limit = 5)
    projects.recent.limit(limit)
  end
end
