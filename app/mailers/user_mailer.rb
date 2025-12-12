class UserMailer < ApplicationMailer
  def password_reset(user, token, client_url)
    @user = user
    @token = token
    @client_url = client_url
    @reset_url = "#{client_url}/reset-password?reset_password_token=#{token}&email=#{CGI.escape(user.email)}"
    
    mail(
      to: @user.email,
      subject: "Resetowanie hasła - Portfolio Creator"
    )
  end
end

