class Project < ApplicationRecord
  belongs_to :user
  has_many :project_likes
  has_many :tags
  has_many :categories
end
