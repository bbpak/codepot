class Api::V1::UsersController < ApplicationController
  before_action :find_user, only: [:update]
  
  def index
    @users = User.all
    render json: @users
  end

  def create
    @user = User.new(**user_params, tokens: 10)

    if @user.save 
      render json: @user, status: :accepted
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessible_entity
    end
  end
  
  def update
    @user.update(user_params)
    if @user.save
      render json: @user, status: :accepted
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    @user.destroy
  end
  
  private
  
  def user_params
    params.permit(:username, :name)
  end
  
  def find_user
    @user = User.find(params[:id])
  end
end
