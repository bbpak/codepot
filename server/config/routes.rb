Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:index, :create, :update, :destroy] do
      resources :follows, only: [:index, :create, :destroy], shallow: true
    end
    resources :projects, only: [:index, :create, :update, :destroy] do
      resources :project_likes, only: [:index, :create, :destroy], shallow: true
    end
  end

  get '/auth/github', to: 'authentication#github', format: false
  get '/signout', to: 'authentication#signout'
end