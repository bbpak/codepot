class ProjectLikesController < ApplicationController
  before_action :find_project_like, only: [:update]
  # before_action :authenticate_user!
  
  def index
    @project_likes = ProjectLike.where(project_id: params[:project_id])
    render json: @project_likes
  end

  def create
    @project_like = ProjectLike.new(project_like_params)

    if @project_like.save 
      render json: @project_like, status: :accepted
    else
      render json: { errors: @project_like.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    @project_like.destroy
  end
  
  private
  
  def project_like_params
    params.permit(:user_id, :project_id)
  end
  
  def find_project_like
    @project_like = ProjectLike.find(params[:id])
  end
end
