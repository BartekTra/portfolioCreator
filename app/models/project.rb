class Project < ApplicationRecord
  belongs_to :user
  has_many_attached :images

  validates :data, presence: true
  validates :user_id, presence: true
end

