require 'rails_helper'

RSpec.describe Api::V1::RepositoriesController, type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:title_page) { create(:title_page, user: user) }
  let(:valid_repository_params) do
    {
      repository: {
        name: "Test Repository",
        description: "Test Description",
        title_page_id: title_page.id
      }
    }
  end

  describe 'GET #index' do
    context 'when authenticated' do
      it 'returns user repositories' do
        repo1 = create(:repository, user: user, title_page: title_page)
        repo2 = create(:repository, user: user, title_page: title_page)
        other_user = create(:user)
        other_title_page = create(:title_page, user: other_user)
        other_repo = create(:repository, user: other_user, title_page: other_title_page)

        get '/api/v1/repositories', headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(2)
        repo_ids = json_response.map { |r| r['id'] }
        expect(repo_ids).to include(repo1.id, repo2.id)
        expect(repo_ids).not_to include(other_repo.id)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/repositories'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    context 'when authenticated' do
      it 'returns the repository' do
        get "/api/v1/repositories/#{repository.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(repository.id)
        expect(json_response['name']).to eq(repository.name)
      end

      it 'returns 404 for non-existent repository' do
        get '/api/v1/repositories/99999', headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it 'returns 404 for other user repository' do
        other_user = create(:user)
        other_title_page = create(:title_page, user: other_user)
        other_repo = create(:repository, user: other_user, title_page: other_title_page)

        get "/api/v1/repositories/#{other_repo.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        get "/api/v1/repositories/#{repository.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #create' do
    context 'when authenticated' do
      it 'creates a new repository' do
        expect {
          post '/api/v1/repositories', params: valid_repository_params, headers: headers
        }.to change(Repository, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq('Test Repository')
        expect(json_response['user_id']).to eq(user.id)
      end

      it 'returns error when title_page_id is missing' do
        invalid_params = {
          repository: {
            name: "Test Repository",
            description: "Test Description"
          }
        }
        post '/api/v1/repositories', params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Title page jest wymagane')
      end

      it 'returns error when title_page does not belong to user' do
        other_user = create(:user)
        other_title_page = create(:title_page, user: other_user)
        invalid_params = {
          repository: {
            name: "Test Repository",
            title_page_id: other_title_page.id
          }
        }
        post '/api/v1/repositories', params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Nie znaleziono strony tytułowej')
      end

      it 'adds projects when project_ids are provided' do
        project1 = create(:project, user: user)
        project2 = create(:project, user: user)
        params_with_projects = valid_repository_params.merge(
          project_ids: [project1.id, project2.id]
        )

        post '/api/v1/repositories', params: params_with_projects, headers: headers

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['project_ids']).to include(project1.id, project2.id)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post '/api/v1/repositories', params: valid_repository_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH #update' do
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    context 'when authenticated' do
      it 'updates the repository' do
        update_params = {
          repository: {
            name: "Updated Repository",
            description: "Updated Description"
          }
        }

        patch "/api/v1/repositories/#{repository.id}", params: update_params, headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq('Updated Repository')
      end

      it 'updates projects when project_ids are provided' do
        project1 = create(:project, user: user)
        project2 = create(:project, user: user)
        update_params = {
          repository: {
            name: repository.name
          },
          project_ids: [project1.id, project2.id]
        }

        patch "/api/v1/repositories/#{repository.id}", params: update_params, headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['project_ids']).to include(project1.id, project2.id)
      end

      it 'returns 404 for other user repository' do
        other_user = create(:user)
        other_title_page = create(:title_page, user: other_user)
        other_repo = create(:repository, user: other_user, title_page: other_title_page)

        patch "/api/v1/repositories/#{other_repo.id}", params: valid_repository_params, headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        patch "/api/v1/repositories/#{repository.id}", params: valid_repository_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:repository) { create(:repository, user: user, title_page: title_page) }

    context 'when authenticated' do
      it 'deletes the repository' do
        expect {
          delete "/api/v1/repositories/#{repository.id}", headers: headers
        }.to change(Repository, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it 'returns 404 for other user repository' do
        other_user = create(:user)
        other_title_page = create(:title_page, user: other_user)
        other_repo = create(:repository, user: other_user, title_page: other_title_page)

        delete "/api/v1/repositories/#{other_repo.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete "/api/v1/repositories/#{repository.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #generate_share_token' do
    let(:repository) { create(:repository, user: user, title_page: title_page) }

    context 'when authenticated' do
      it 'generates a share token' do
        post "/api/v1/repositories/#{repository.id}/generate_share_token", headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['token']).to be_present
        expect(json_response['share_url']).to be_present
      end

      it 'saves the token to the repository' do
        post "/api/v1/repositories/#{repository.id}/generate_share_token", headers: headers

        repository.reload
        expect(repository.public_share_token).to be_present
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        post "/api/v1/repositories/#{repository.id}/generate_share_token"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

