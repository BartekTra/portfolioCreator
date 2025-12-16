require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:projects).dependent(:destroy) }
    it { should have_many(:repositories).dependent(:destroy) }
    it { should have_many(:title_pages).dependent(:destroy) }
    it { should have_one_attached(:avatar) }
  end

  describe 'validations' do
    subject { build(:user) }
    
    it { should validate_presence_of(:email) }
    
    it 'validates uniqueness of email scoped to provider' do
      user1 = create(:user, email: "test@example.com", provider: "email")
      user2 = build(:user, email: "test@example.com", provider: "email")
      expect(user2).not_to be_valid
      expect(user2.errors[:email]).to include("has already been taken")
    end
  end

  describe 'devise modules' do
    it 'should be database_authenticatable' do
      user = build(:user)
      expect(user).to respond_to(:valid_password?)
    end

    it 'should be registerable' do
      user = build(:user)
      expect(user).to respond_to(:email)
    end

    it 'should be confirmable' do
      user = build(:user, :unconfirmed)
      expect(user.confirmed?).to be false
      expect(user.confirmation_token).to be_present
    end
  end

  describe '#project_count' do
    let(:user) { create(:user) }

    it 'returns the count of projects' do
      create_list(:project, 3, user: user)
      expect(user.project_count).to eq(3)
    end

    it 'returns 0 when user has no projects' do
      expect(user.project_count).to eq(0)
    end
  end

  describe '#recent_projects' do
    let(:user) { create(:user) }

    it 'returns recent projects ordered by created_at desc' do
      project1 = create(:project, user: user, created_at: 2.days.ago)
      project2 = create(:project, user: user, created_at: 1.day.ago)
      project3 = create(:project, user: user, created_at: Time.current)

      recent = user.recent_projects(3)
      expect(recent).to eq([project3, project2, project1])
    end

    it 'respects the limit parameter' do
      create_list(:project, 5, user: user)
      expect(user.recent_projects(3).count).to eq(3)
    end
  end
end

