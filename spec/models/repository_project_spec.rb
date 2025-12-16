require 'rails_helper'

RSpec.describe RepositoryProject, type: :model do
  describe 'associations' do
    it { should belong_to(:repository) }
    it { should belong_to(:project) }
  end

  describe 'validations' do
    subject { build(:repository_project) }
    
    it { should validate_presence_of(:repository) }
    it { should validate_presence_of(:project) }
    it { should validate_numericality_of(:position).is_greater_than_or_equal_to(0).only_integer }
    
    it 'validates uniqueness of project_id scoped to repository_id' do
      repo_project1 = create(:repository_project)
      repo_project2 = build(:repository_project, 
                             repository: repo_project1.repository, 
                             project: repo_project1.project)
      expect(repo_project2).not_to be_valid
      expect(repo_project2.errors[:project_id]).to include("jest już w tym repozytorium")
    end
  end

  describe 'callbacks' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }
    let(:repository) { create(:repository, user: user, title_page: title_page) }
    let(:project) { create(:project, user: user) }

    describe 'before_validation :set_default_position' do
      it 'sets default position when not provided' do
        repo_project = RepositoryProject.new(repository: repository, project: project)
        repo_project.valid?
        expect(repo_project.position).to be >= 0
      end

      it 'sets position based on maximum existing position' do
        existing_project = create(:project, user: user)
        # Create first project without position (will use callback)
        existing_repo_project = RepositoryProject.create(repository: repository, project: existing_project)
        # Manually update position to simulate existing projects
        existing_repo_project.update_column(:position, 5)

        # Create new project without position - should get max + 1
        new_repo_project = RepositoryProject.new(repository: repository, project: project)
        new_repo_project.position = nil # Ensure position is nil
        new_repo_project.save!
        expect(new_repo_project.position).to eq(6)
      end

      it 'does not override provided position' do
        repo_project = RepositoryProject.new(repository: repository, project: project, position: 10)
        repo_project.valid?
        expect(repo_project.position).to eq(10)
      end
    end
  end

  describe 'uniqueness validation' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }
    let(:repository) { create(:repository, user: user, title_page: title_page) }
    let(:project) { create(:project, user: user) }

    it 'prevents adding the same project twice to a repository' do
      create(:repository_project, repository: repository, project: project)
      duplicate = build(:repository_project, repository: repository, project: project)
      
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:project_id]).to be_present
    end

    it 'allows the same project in different repositories' do
      repository2 = create(:repository, user: user, title_page: title_page)
      
      create(:repository_project, repository: repository, project: project)
      repo_project2 = build(:repository_project, repository: repository2, project: project)
      
      expect(repo_project2).to be_valid
    end
  end
end

