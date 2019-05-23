Rails.application.routes.draw do
  resources :users, only: [:index, :create, :update, :destroy] do
    resources :follows, only: [:index, :create, :destroy], shallow: true
  end
  resources :projects, only: [:index, :create, :update, :destroy] do
    resources :project_likes, only: [:index, :create, :destroy], shallow: true
  end

  get '/user/:id/projects', to: 'users#projects'

  get '/auth/github', to: 'authentication#github', format: false
  get '/signout', to: 'authentication#signout'
end