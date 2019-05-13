# https://www.railstutorial.org/book/following_users
# https://medium.com/@esmerycornielle/making-a-followers-feature-with-ruby-on-rails-and-active-record-ddb3d1dda060
class User < ApplicationRecord
  has_many :projects, dependent: :destroy
  has_many :project_likes, dependent: :destroy
  has_many :follows, dependent: :destroy
  has_many :follower_relationships, class_name: "Follow", 
                                    foreign_key: "following_id",
                                    dependent: :destroy
  has_many :followers, through: :follower_relationships, source: :follower
  has_many :following_relationships, class_name: "Follow", 
                                    foreign_key: "follower_id",
                                    dependent: :destroy
  has_many :following, through: :following_relationships, source: :following

  def follow(other_user)
    following << other_user
  end

  # Unfollows a user.
  def unfollow(other_user)
    following.delete(other_user)
  end

  # Returns true if the current user is following the other user.
  def following?(other_user)
    following.include?(other_user)
  end
end
