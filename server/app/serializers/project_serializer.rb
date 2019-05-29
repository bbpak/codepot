class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :display_name, :repo_url, :project_url, :image_url, :description, :markdown
  belongs_to :user
  has_many :tags, through: :project_tags
end
