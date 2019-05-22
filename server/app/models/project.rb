class Project < ApplicationRecord
  belongs_to :user, optional: true
  has_many :project_likes
  has_many :tags
  has_many :categories
end
