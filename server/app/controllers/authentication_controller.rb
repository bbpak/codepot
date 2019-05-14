# https://groundberry.github.io/development/2017/04/08/build-an-app-with-rails-and-react-user-authentication.html

class AuthenticationController < ApplicationController
  def github
    authenticator = Authenticator.new
    user_info = authenticator.github(params[:code])
    login = user_info[:login]

    # Generate token...
    token = Tokenizer.encode(login)

    # ... create user if it doesn't exist...
    User.where(login: login).first_or_create!(
      name: name,
      avatar_url: avatar_url
    )
    
    # ... and redirect to client app.
    redirect_to "#{issuer}?token=#{token}"
    
    rescue StandardError => error
      redirect_to "#{issuer}?error=#{error.message}"
  end

  private

  def issuer
    ENV['CLIENT_URL']
  end
end