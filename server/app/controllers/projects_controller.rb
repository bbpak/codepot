class ProjectsController < ApplicationController
  before_action :find_project, only: [:update]
  # before_action :authenticate_user!
  
  def index
    @projects = Project.all
    render json: @projects
  end

  def create
    @project = Project.new(
      project_params
    )

    if @project.save 
      render json: @project, status: :accepted
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessible_entity
    end
  end
  
  def update
    @project.update(project_params)
    if @project.save
      render json: @project, status: :accepted
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    @project.destroy
  end

  def tags
    render json: Tag.all.order(:name)
  end

  def create_tag
    Tag.create!(name: params[:name])
  end
    
  private
  
  def project_params
    params.require(:project).permit!
  end
  
  def find_project
    @project = Project.find(params[:id])
  end
end
