module DeviseTokenAuthTestHelpers
  def auth_headers(user)
    client_id = SecureRandom.urlsafe_base64(nil, false)
    token = Devise.friendly_token
    expiry = (Time.current + 2.weeks).to_i

    user.tokens ||= {}
    user.tokens[client_id] = {
      token: BCrypt::Password.create(token),
      expiry: expiry
    }
    user.save!

    {
      'access-token' => token,
      'client' => client_id,
      'uid' => user.uid
    }
  end
end

RSpec.configure do |config|
  config.include DeviseTokenAuthTestHelpers, type: :request
end

# Ensure BCrypt is available
require 'bcrypt' unless defined?(BCrypt)

