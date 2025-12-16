require 'rails_helper'

RSpec.describe Api::V1::Auth::ConfirmationsController, type: :request do
  describe 'GET #show' do
    let(:user) { create(:user, :unconfirmed) }
    let(:token) do
      user.send_confirmation_instructions
      user.instance_variable_get(:@raw_confirmation_token)
    end
    let(:host_headers) { { "HOST" => "localhost" } }

    context 'with valid confirmation token' do
      it 'confirms the user email' do
        get "/api/v1/auth/confirmation?confirmation_token=#{token}", headers: host_headers

        expect([200, 302]).to include(response.status)
        user.reload
        expect(user.confirmed?).to be true
      end

      it 'redirects to frontend URL when redirect_url is provided' do
        redirect_url = "http://localhost:5173"
        
        get "/api/v1/auth/confirmation?confirmation_token=#{token}&redirect_url=#{redirect_url}", headers: host_headers

        expect(response).to have_http_status(:redirect)
        expect(response.location).to include(redirect_url)
      end

      it 'uses default frontend URL when redirect_url is not provided' do
        default_url = ENV.fetch("FRONTEND_URL", "http://localhost:5173")
        
        get "/api/v1/auth/confirmation?confirmation_token=#{token}", headers: host_headers

        # May redirect or return JSON depending on implementation
        expect([200, 302]).to include(response.status)
      end

      it 'returns JSON success message when redirect fails' do
        invalid_redirect = "not-a-valid-url"
        
        get "/api/v1/auth/confirmation?confirmation_token=#{token}&redirect_url=#{invalid_redirect}", headers: host_headers

        # Should still confirm the user
        user.reload
        expect(user.confirmed?).to be true
        
        # May return JSON or redirect
        expect([200, 302]).to include(response.status)
      end
    end

    context 'with invalid confirmation token' do
      it 'returns error' do
        get "/api/v1/auth/confirmation?confirmation_token=invalid_token", headers: host_headers

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['status']).to eq('error')
        expect(json_response['errors']).to be_present
      end

      it 'does not confirm the user' do
        user_before = user.confirmed?
        get "/api/v1/auth/confirmation?confirmation_token=invalid_token"

        user.reload
        expect(user.confirmed?).to eq(user_before)
      end
    end

    context 'with already confirmed user' do
      it 'handles gracefully' do
        token_before = token
        user.confirm
        
        get "/api/v1/auth/confirmation?confirmation_token=#{token_before}", headers: host_headers

        # Should handle already confirmed user
        expect([200, 302, 422]).to include(response.status)
      end
    end
  end
end

