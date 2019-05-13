class ProjectLike < ApplicationRecord
  has_many :tags
  has_many :categories
  belongs_to :project
  belongs_to :user
end
