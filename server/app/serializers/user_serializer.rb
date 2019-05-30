class UserSerializer < ActiveModel::Serializer
  attributes :id, :github_id, :username, :name, :projects
  has_many :projects, dependent: :destroy
end
