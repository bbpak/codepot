class ProjectsController < ApplicationController
  before_action :find_project, only: [:update]
  # before_action :authenticate_user!
  
  def index
    @projects = Project.all
    projects_json = []
    @projects.each do |project|
      projects_json << project_json(project)
    end

    render json: projects_json
  end

  def show 
    @project = Project.find_by(name: params[:project])
    project_json = project_json(@project)
    render json: project_json(@project)
  end

  def create
    @project = Project.new(project_params)

    if @project.save 
      params[:tags].each do |tag_name|
        tag = Tag.find_by(name: tag_name)
        if tag
          ProjectTag.create(project_id: @project.id, tag_id: tag.id)
        end
      end

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

  def project_json(project)
    project.attributes.merge({owner: project.user.username, tags: project.tags})
  end
end
