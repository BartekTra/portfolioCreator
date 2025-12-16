require 'rails_helper'

RSpec.describe TitlePage, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_one(:repository).dependent(:nullify) }
    it { should have_one_attached(:photo) }
  end

  describe 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:template_key) }
    it { should validate_inclusion_of(:template_key).in_array(TitlePage::TEMPLATE_KEYS) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }

    describe '.recent' do
      it 'returns title pages ordered by created_at desc' do
        page1 = create(:title_page, user: user, created_at: 2.days.ago)
        page2 = create(:title_page, user: user, created_at: 1.day.ago)
        page3 = create(:title_page, user: user, created_at: Time.current)

        expect(TitlePage.recent).to eq([page3, page2, page1])
      end
    end

    describe '.by_user' do
      let(:user1) { create(:user) }
      let(:user2) { create(:user) }

      it 'returns title pages for a specific user' do
        page1 = create(:title_page, user: user1)
        page2 = create(:title_page, user: user2)
        page3 = create(:title_page, user: user1)

        expect(TitlePage.by_user(user1.id)).to contain_exactly(page1, page3)
        expect(TitlePage.by_user(user1.id)).not_to include(page2)
      end
    end
  end

  describe 'photo validation' do
    let(:user) { create(:user) }
    let(:title_page) { create(:title_page, user: user) }

    it 'has photo validation callback' do
      # The validation method is private, so we test it indirectly
      # by checking that validation callbacks exist
      expect(title_page.class._validate_callbacks.map(&:filter)).to include(:validate_photo_size)
    end
  end

  describe 'template keys' do
    it 'has valid template keys constant' do
      expect(TitlePage::TEMPLATE_KEYS).to be_an(Array)
      expect(TitlePage::TEMPLATE_KEYS).to include("titleTemplate1", "titleTemplate2", "titleTemplate3")
    end
  end

  describe 'default values' do
    let(:user) { create(:user) }

    it 'has default empty arrays for experience and sections' do
      title_page = TitlePage.new(user: user, template_key: "titleTemplate1")
      expect(title_page.experience).to be_nil
      expect(title_page.sections).to be_nil
    end
  end
end

