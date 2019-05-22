# https://groundberry.github.io/development/2017/04/08/build-an-app-with-rails-and-react-user-authentication.html
class AuthenticationController < ApplicationController
  include ActionController::Helpers
  include ActionController::Cookies

  def github
    authenticator = Authenticator.new
    user_info = authenticator.github(params[:code])
    login = user_info[:login]

    # Generate token...
    token = Tokenizer.encode(login)
    
    # ... create user if it doesn't exist...
    user = User.find_or_create_by!(
      username: login,
      name: user_info[:name],
      github_id: user_info[:github_id]
    )

    # Store user data in cookies and access from client
    cookies[:current_user] = {
      id: user.id,
      username: user.username,
      github_id: user.github_id,
      token: token
    }.to_json

    # ... and redirect to client app.
    redirect_to "#{ENV['CLIENT_URL']}/"

    rescue StandardError => error
      redirect_to "#{ENV['CLIENT_URL']}/#{error}"
  end

  def signout
    cookies[:current_user] = nil
    @current_user = nil
  end
end