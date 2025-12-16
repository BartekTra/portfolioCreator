require 'rails_helper'

RSpec.describe Api::V1::TitlePagesController, type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:valid_title_page_params) do
    {
      phone: "123456789",
      email: "test@example.com",
      address: "Test Address",
      bio: "Test Bio",
      experience: [],
      sections: [],
      template_key: "titleTemplate1"
    }
  end

  describe 'GET #index' do
    context 'when authenticated' do
      it 'returns user title pages' do
        page1 = create(:title_page, user: user)
        page2 = create(:title_page, user: user)
        other_user = create(:user)
        other_page = create(:title_page, user: other_user)

        get '/api/v1/title_pages', headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(2)
        page_ids = json_response.map { |p| p['id'] }
        expect(page_ids).to include(page1.id, page2.id)
        expect(page_ids).not_to include(other_page.id)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/title_pages'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    let(:title_page) { create(:title_page, user: user) }

    context 'when authenticated' do
      it 'returns the title page' do
        get "/api/v1/title_pages/#{title_page.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(title_page.id)
        expect(json_response['template_key']).to eq(title_page.template_key)
      end

      it 'returns 404 for non-existent title page' do
        get '/api/v1/title_pages/99999', headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it 'returns 404 for other user title page' do
        other_user = create(:user)
        other_page = create(:title_page, user: other_user)

        get "/api/v1/title_pages/#{other_page.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get "/api/v1/title_pages/#{title_page.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #create' do
    context 'when authenticated' do
      it 'creates a new title page' do
        expect {
          post '/api/v1/title_pages', params: valid_title_page_params, headers: headers
        }.to change(TitlePage, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['phone']).to eq('123456789')
        expect(json_response['user_id']).to eq(user.id)
      end

      it 'uses default template if not provided' do
        params_without_template = valid_title_page_params.except(:template_key)
        post '/api/v1/title_pages', params: params_without_template, headers: headers

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['template_key']).to eq('titleTemplate1')
      end

      it 'returns error for invalid template' do
        invalid_params = valid_title_page_params.merge(template_key: "invalidTemplate")
        post '/api/v1/title_pages', params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('Niepoprawny template')
      end

      it 'parses JSON strings for experience and sections' do
        params_with_json = valid_title_page_params.merge(
          experience: '[{"company": "Test"}]',
          sections: '[{"type": "languages"}]'
        )
        post '/api/v1/title_pages', params: params_with_json, headers: headers

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['experience']).to be_an(Array)
        expect(json_response['sections']).to be_an(Array)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post '/api/v1/title_pages', params: valid_title_page_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH #update' do
    let(:title_page) { create(:title_page, user: user) }

    context 'when authenticated' do
      it 'updates the title page' do
        update_params = {
          phone: "987654321",
          bio: "Updated Bio"
        }

        patch "/api/v1/title_pages/#{title_page.id}", params: update_params, headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['phone']).to eq('987654321')
        expect(json_response['bio']).to eq('Updated Bio')
      end

      it 'returns error for invalid template' do
        invalid_params = { template_key: "invalidTemplate" }
        patch "/api/v1/title_pages/#{title_page.id}", params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns 404 for other user title page' do
        other_user = create(:user)
        other_page = create(:title_page, user: other_user)

        patch "/api/v1/title_pages/#{other_page.id}", params: valid_title_page_params, headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        patch "/api/v1/title_pages/#{title_page.id}", params: valid_title_page_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:title_page) { create(:title_page, user: user) }

    context 'when authenticated' do
      it 'deletes the title page' do
        expect {
          delete "/api/v1/title_pages/#{title_page.id}", headers: headers
        }.to change(TitlePage, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it 'returns 404 for other user title page' do
        other_user = create(:user)
        other_page = create(:title_page, user: other_user)

        delete "/api/v1/title_pages/#{other_page.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete "/api/v1/title_pages/#{title_page.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

