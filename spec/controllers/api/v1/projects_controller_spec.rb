require 'rails_helper'

RSpec.describe Api::V1::ProjectsController, type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:valid_project_data) do
    {
      data: {
        sections: [
          {
            id: 1234567890,
            type: "title",
            value: "Test Project",
            order: 0
          }
        ],
        template_key: "templateA"
      }.to_json,
      template_key: "templateA"
    }
  end

  describe 'GET #index' do
    context 'when authenticated' do
      it 'returns user projects' do
        project1 = create(:project, user: user)
        project2 = create(:project, user: user)
        other_user = create(:user)
        other_project = create(:project, user: other_user)

        get '/api/v1/projects', headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(2)
        project_ids = json_response.map { |p| p['id'] }
        expect(project_ids).to include(project1.id, project2.id)
        expect(project_ids).not_to include(other_project.id)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/projects'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    let(:project) { create(:project, user: user) }

    context 'when authenticated' do
      it 'returns the project' do
        get "/api/v1/projects/#{project.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(project.id)
        expect(json_response['template_key']).to eq(project.template_key)
      end

      it 'returns 404 for non-existent project' do
        get '/api/v1/projects/99999', headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it 'returns 404 for other user project' do
        other_user = create(:user)
        other_project = create(:project, user: other_user)

        get "/api/v1/projects/#{other_project.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get "/api/v1/projects/#{project.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #create' do
    context 'when authenticated' do
      it 'creates a new project' do
        post '/api/v1/projects', params: valid_project_data, headers: headers
        
        if response.status != 201
          puts "Response status: #{response.status}"
          puts "Response body: #{response.body}"
        end
        
        expect(response).to have_http_status(:created)
        expect(Project.count).to eq(1)
        json_response = JSON.parse(response.body)
        expect(json_response['template_key']).to eq('templateA')
        expect(json_response['user_id']).to eq(user.id)
      end

      it 'returns error for invalid template' do
        invalid_data = valid_project_data.merge(template_key: "invalidTemplate")
        post '/api/v1/projects', params: invalid_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('Niepoprawny template')
      end

      it 'returns error for empty sections' do
        invalid_data = {
          data: { sections: [] },
          template_key: "templateA"
        }
        post '/api/v1/projects', params: invalid_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('przynajmniej jedną sekcję')
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post '/api/v1/projects', params: valid_project_data
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH #update' do
    let(:project) { create(:project, user: user) }

    context 'when authenticated' do
      it 'updates the project' do
        update_data = {
          data: {
            sections: [
              {
                id: 1234567890,
                type: "title",
                value: "Updated Title",
                order: 0
              }
            ],
            template_key: "templateA"
          }.to_json,
          template_key: "templateA"
        }

        patch "/api/v1/projects/#{project.id}", params: update_data, headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['data']['sections'][0]['value']).to eq('Updated Title')
      end

      it 'returns error for invalid template' do
        invalid_data = valid_project_data.merge(template_key: "invalidTemplate")
        patch "/api/v1/projects/#{project.id}", params: invalid_data, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns 404 for other user project' do
        other_user = create(:user)
        other_project = create(:project, user: other_user)

        patch "/api/v1/projects/#{other_project.id}", params: valid_project_data, headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        patch "/api/v1/projects/#{project.id}", params: valid_project_data
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:project) { create(:project, user: user) }

    context 'when authenticated' do
      it 'deletes the project' do
        expect {
          delete "/api/v1/projects/#{project.id}", headers: headers
        }.to change(Project, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it 'returns 404 for other user project' do
        other_user = create(:user)
        other_project = create(:project, user: other_user)

        delete "/api/v1/projects/#{other_project.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete "/api/v1/projects/#{project.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

