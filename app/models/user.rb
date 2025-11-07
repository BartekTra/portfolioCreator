# app/models/user.rb
class User < ActiveRecord::Base
  extend Devise::Models

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  include DeviseTokenAuth::Concerns::User

  has_one_attached :avatar

  validates :email, presence: true, uniqueness: true
  validates :first_name, :surname, presence: true, on: :create
end
