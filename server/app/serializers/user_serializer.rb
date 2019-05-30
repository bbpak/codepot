class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :name, :projects
  has_many :projects, dependent: :destroy
end
