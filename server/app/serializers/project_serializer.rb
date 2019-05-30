class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :display_name, :user, :repo_url, :project_url, :image_id, :description, :markdown
  belongs_to :user
  has_many :tags, through: :project_tags
end
