require 'rails_helper'

RSpec.describe Api::V1::Auth::SessionsController, type: :request do
  describe 'POST #create' do
    let(:user) { create(:user, email: "test@example.com", password: "password123") }

    context 'with valid credentials' do
      it 'returns auth tokens for confirmed user' do
        user.confirm

        post '/api/v1/auth/sign_in', params: {
          email: "test@example.com",
          password: "password123"
        }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data']['email']).to eq('test@example.com')
        expect(json_response['tokens']).to be_present
      end

      it 'returns user data' do
        user.confirm

        post '/api/v1/auth/sign_in', params: {
          email: "test@example.com",
          password: "password123"
        }

        json_response = JSON.parse(response.body)
        expect(json_response['data']).to include('id', 'email', 'first_name', 'surname', 'nickname')
      end
    end

    context 'with unconfirmed user' do
      it 'returns error message' do
        user.update(confirmed_at: nil)

        post '/api/v1/auth/sign_in', params: {
          email: "test@example.com",
          password: "password123"
        }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response['message']).to include('potwierdzić')
      end

      it 'does not return auth tokens' do
        user.update(confirmed_at: nil)

        post '/api/v1/auth/sign_in', params: {
          email: "test@example.com",
          password: "password123"
        }

        json_response = JSON.parse(response.body)
        expect(json_response['tokens']).to be_nil
      end
    end

    context 'with invalid credentials' do
      it 'returns error for wrong password' do
        user.confirm

        post '/api/v1/auth/sign_in', params: {
          email: "test@example.com",
          password: "wrong_password"
        }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response['message']).to include('Invalid email or password')
      end

      it 'returns error for non-existent email' do
        post '/api/v1/auth/sign_in', params: {
          email: "nonexistent@example.com",
          password: "password123"
        }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
      end
    end
  end

  describe 'DELETE #destroy' do
    let(:user) { create(:user) }
    let(:headers) { auth_headers(user) }

    context 'when authenticated' do
      it 'signs out successfully' do
        delete '/api/v1/auth/sign_out', headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['message']).to include('Signed out')
      end

      it 'removes the token from user' do
        client_id = headers['client']
        expect(user.tokens[client_id]).to be_present

        delete '/api/v1/auth/sign_out', headers: headers

        user.reload
        expect(user.tokens[client_id]).to be_nil
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        delete '/api/v1/auth/sign_out'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid token' do
      it 'returns error' do
        invalid_headers = {
          'access-token' => 'invalid_token',
          'client' => 'invalid_client',
          'uid' => user.uid
        }

        delete '/api/v1/auth/sign_out', headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

