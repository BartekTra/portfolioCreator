require 'rails_helper'

RSpec.describe Repository, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:title_page) }
    it { should have_many(:repository_projects).dependent(:destroy) }
    it { should have_many(:projects).through(:repository_projects) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:title_page) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }

    describe '.recent' do
      it 'returns repositories ordered by created_at desc' do
        repo1 = create(:repository, user: user, title_page: title_page, created_at: 2.days.ago)
        repo2 = create(:repository, user: user, title_page: title_page, created_at: 1.day.ago)
        repo3 = create(:repository, user: user, title_page: title_page, created_at: Time.current)

        expect(Repository.recent).to eq([repo3, repo2, repo1])
      end
    end

    describe '.by_user' do
      let(:user1) { create(:user) }
      let(:user2) { create(:user) }
      let(:title_page1) { create(:title_page, user: user1) }
      let(:title_page2) { create(:title_page, user: user2) }

      it 'returns repositories for a specific user' do
        repo1 = create(:repository, user: user1, title_page: title_page1)
        repo2 = create(:repository, user: user2, title_page: title_page2)
        repo3 = create(:repository, user: user1, title_page: title_page1)

        expect(Repository.by_user(user1.id)).to contain_exactly(repo1, repo3)
        expect(Repository.by_user(user1.id)).not_to include(repo2)
      end
    end
  end

  describe '#projects_ordered' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    it 'returns projects ordered by position' do
      project1 = create(:project, user: user)
      project2 = create(:project, user: user)
      project3 = create(:project, user: user)

      create(:repository_project, repository: repository, project: project1, position: 2)
      create(:repository_project, repository: repository, project: project2, position: 0)
      create(:repository_project, repository: repository, project: project3, position: 1)

      expect(repository.projects_ordered).to eq([project2, project3, project1])
    end
  end

  describe '#project_count' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    it 'returns the count of projects' do
      create_list(:repository_project, 3, repository: repository)
      expect(repository.project_count).to eq(3)
    end

    it 'returns 0 when repository has no projects' do
      expect(repository.project_count).to eq(0)
    end
  end

  describe '#generate_share_token!' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    it 'generates a unique share token' do
      token = repository.generate_share_token!
      expect(token).to be_present
      expect(token.length).to be > 0
      expect(repository.public_share_token).to eq(token)
    end

    it 'saves the token to the repository' do
      token = repository.generate_share_token!
      repository.reload
      expect(repository.public_share_token).to eq(token)
    end

    it 'generates unique tokens for different repositories' do
      repo1 = create(:repository, user: user, title_page: title_page)
      repo2 = create(:repository, user: user, title_page: title_page)

      token1 = repo1.generate_share_token!
      token2 = repo2.generate_share_token!

      expect(token1).not_to eq(token2)
    end
  end
end

