# app/models/repository_project.rb
class RepositoryProject < ApplicationRecord
  belongs_to :repository
  belongs_to :project

  # Walidacje
  validates :repository, presence: true
  validates :project, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :project_id, uniqueness: { scope: :repository_id, message: "jest już w tym repozytorium" }

  # Callbacks
  before_validation :set_default_position, on: :create

  private

  def set_default_position
    return if position.present?
    
    max_position = repository.repository_projects.maximum(:position) || -1
    self.position = max_position + 1
  end
end

