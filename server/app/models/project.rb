class Project < ApplicationRecord
  belongs_to :user, optional: true
  has_many :project_likes
  has_many :project_tags
  has_many :tags, through: :project_tags
  has_many :categories

  def owner
    self.user.username
  end
end
