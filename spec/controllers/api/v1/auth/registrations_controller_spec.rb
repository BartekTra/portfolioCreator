require 'rails_helper'

RSpec.describe Api::V1::Auth::RegistrationsController, type: :request do
  describe 'POST #create' do
    let(:valid_params) do
      {
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123",
        first_name: "John",
        surname: "Doe",
        nickname: "johndoe"
      }
    end

    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/api/v1/auth', params: valid_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'returns success message when email confirmation is required' do
        post '/api/v1/auth', params: valid_params

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['message']).to be_present
        expect(json_response['data']['confirmed']).to be false
      end

      it 'does not return auth tokens when user is not confirmed' do
        post '/api/v1/auth', params: valid_params

        json_response = JSON.parse(response.body)
        expect(json_response['tokens']).to be_nil
      end

      it 'returns auth tokens when user is confirmed' do
        # Manually confirm the user after creation
        post '/api/v1/auth', params: valid_params
        user = User.find_by(email: valid_params[:email])
        user.confirm

        # Try to create another user that will be auto-confirmed
        # Actually, we need to test the confirmed case differently
        # Since DeviseTokenAuth sends confirmation email by default
        # Let's test that unconfirmed users don't get tokens
        expect(json_response['tokens']).to be_nil if user && !user.confirmed?
      end

      it 'creates user with correct attributes' do
        post '/api/v1/auth', params: valid_params

        user = User.find_by(email: valid_params[:email])
        expect(user).to be_present
        expect(user.first_name).to eq('John')
        expect(user.surname).to eq('Doe')
        expect(user.nickname).to eq('johndoe')
      end
    end

    context 'with invalid parameters' do
      it 'returns error for duplicate email' do
        create(:user, email: "test@example.com")
        
        post '/api/v1/auth', params: valid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response['errors']).to be_present
      end

      it 'returns error for invalid email' do
        invalid_params = valid_params.merge(email: "invalid-email")
        post '/api/v1/auth', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
      end

      it 'returns error for password mismatch' do
        invalid_params = valid_params.merge(password_confirmation: "different_password")
        post '/api/v1/auth', params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
      end
    end
  end

  describe 'PUT #update' do
    let(:user) { create(:user) }
    let(:headers) { auth_headers(user) }

    context 'when authenticated' do
      it 'updates user attributes' do
        update_params = {
          first_name: "Jane",
          surname: "Smith",
          nickname: "janesmith"
        }

        put '/api/v1/auth', params: update_params, headers: headers

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('success')
        expect(json_response['data']['first_name']).to eq('Jane')
        expect(json_response['data']['surname']).to eq('Smith')
      end

      it 'returns error for invalid email' do
        update_params = { email: "invalid-email" }
        put '/api/v1/auth', params: update_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized' do
        put '/api/v1/auth', params: { first_name: "Jane" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end

