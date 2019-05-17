# https://groundberry.github.io/development/2017/04/08/build-an-app-with-rails-and-react-user-authentication.html

class AuthenticationController < ApplicationController
  def github
    authenticator = Authenticator.new
    user_info = authenticator.github(params[:code])
    login = user_info[:login]

    # Generate token...
    token = Tokenizer.encode(login)
    # cookies[:token] = token
    
    # ... create user if it doesn't exist...
    User.find_or_create_by!(
      username: login,
      name: user_info[:name],
      github_id: user_info[:github_id]
    )
    
    # ... and redirect to client app.
    redirect_to "#{ENV['CLIENT_URL']}"
    
    rescue StandardError => error
      redirect_to "#{ENV['CLIENT_URL']}?error=#{error.message}"
  end
end