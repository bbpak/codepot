class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :repo_url, :project_url, :cover_image_url, :description
  belongs_to :user
  has_many :tags, through: :project_tags
end
