# https://groundberry.github.io/development/2017/04/08/build-an-app-with-rails-and-react-user-authentication.html

class Authenticator
  def initialize(connection = Faraday.new)
    @connection = connection
  end

  def github(code)
    access_token_resp = fetch_github_access_token(code)
    access_token = access_token_resp['access_token']
    user_resp = fetch_github_user(access_token)
    
    {
      issuer: ENV['CLIENT_URL'],
      login: user_resp['login'],
      name: user_resp['name'],
      id: user_resp['id']
    }
  end

  private

  def fetch_github_access_token(code)
    resp = @connection.post ENV['GITHUB_ACCESS_TOKEN_URL'], {
      code:          code,
      client_id:     ENV['CLIENT_ID'],
      client_secret: ENV['CLIENT_SECRET']
    }
    raise IOError, 'FETCH_ACCESS_TOKEN' unless resp.success?
    URI.decode_www_form(resp.body).to_h
  end

  def fetch_github_user(access_token)
    resp = @connection.get ENV['GITHUB_USER_URL'], {
      access_token: access_token
    }
    raise IOError, 'FETCH_USER' unless resp.success?
    JSON.parse(resp.body)
  end
end