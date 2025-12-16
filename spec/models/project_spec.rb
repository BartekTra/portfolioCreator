require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many_attached(:images) }
  end

  describe 'validations' do
    it { should validate_presence_of(:data) }
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:template_key) }
    it { should validate_inclusion_of(:template_key).in_array(Project::TEMPLATE_KEYS) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }

    describe '.recent' do
      it 'returns projects ordered by created_at desc' do
        project1 = create(:project, user: user, created_at: 2.days.ago)
        project2 = create(:project, user: user, created_at: 1.day.ago)
        project3 = create(:project, user: user, created_at: Time.current)

        expect(Project.recent).to eq([project3, project2, project1])
      end
    end

    describe '.by_user' do
      let(:user1) { create(:user) }
      let(:user2) { create(:user) }

      it 'returns projects for a specific user' do
        project1 = create(:project, user: user1)
        project2 = create(:project, user: user2)
        project3 = create(:project, user: user1)

        expect(Project.by_user(user1.id)).to contain_exactly(project1, project3)
        expect(Project.by_user(user1.id)).not_to include(project2)
      end
    end
  end

  describe 'data structure validation' do
    let(:user) { create(:user) }

    it 'is valid with proper data structure' do
      project = build(:project, user: user)
      expect(project).to be_valid
    end

    it 'is invalid when data is not a hash' do
      project = build(:project, user: user, data: "invalid")
      expect(project).not_to be_valid
      expect(project.errors[:data]).to include("must be a valid JSON object")
    end

    it 'is invalid when sections is not an array' do
      project = build(:project, user: user, data: { "sections" => "invalid" })
      expect(project).not_to be_valid
      expect(project.errors[:data]).to include("must have sections array")
    end

    it 'is invalid when section lacks id and type' do
      project = build(:project, user: user, data: { "sections" => [{ "order" => 0 }] })
      expect(project).not_to be_valid
      expect(project.errors[:data]).to include("section at index 0 must have id and type")
    end

    it 'is invalid when section lacks numeric order' do
      project = build(:project, user: user, data: {
        "sections" => [{ "id" => 1, "type" => "title", "order" => "invalid" }]
      })
      expect(project).not_to be_valid
      expect(project.errors[:data]).to include("section at index 0 must have numeric order")
    end

    it 'is invalid when template_key in data does not match project template_key' do
      project = build(:project, user: user, template_key: "templateA", data: {
        "sections" => [{ "id" => 1, "type" => "title", "order" => 0 }],
        "template_key" => "templateB"
      })
      expect(project).not_to be_valid
      expect(project.errors[:data]).to include("template_key must match project template")
    end
  end

  describe 'images validation' do
    let(:user) { create(:user) }
    let(:project) { create(:project, user: user) }

    it 'has images validation callback' do
      # The validation method is private, so we test it indirectly
      # by checking that validation callbacks exist
      expect(project.class._validate_callbacks.map(&:filter)).to include(:validate_images_size)
    end
  end

  describe 'template keys' do
    it 'has valid template keys constant' do
      expect(Project::TEMPLATE_KEYS).to be_an(Array)
      expect(Project::TEMPLATE_KEYS).to include("templateA", "templateB", "templateC")
    end
  end
end

