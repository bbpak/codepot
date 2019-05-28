class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :full_name, :repo_url, :project_url, :image_url, :description
  belongs_to :user
  has_many :tags, through: :project_tags
end
