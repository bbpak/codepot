class Api::FollowsController < ApplicationController
  before_action :find_follow, only: [:update]
  before_action :authenticate_user!
  
  def index
    @follows = Follow.where(followed_id: params[:user_id])
                .or(Follow.where(follower_id: params[:user_id]))
    render json: @follows
  end

  def followers

  end

  def following

  end

  def create
    @follow = Follow.new(follow_params)

    if @follow.save 
      render json: @follow, status: :accepted
    else
      render json: { errors: @follow.errors.full_messages }, status: :unprocessible_entity
    end
  end
  
  def destroy
    @follow.destroy
  end
  
  private
  
  def follow_params
    params.permit(:follower_id, :followed_id)
  end
  
  def find_follow
    @follow = Follow.find(params[:id])
  end
end
