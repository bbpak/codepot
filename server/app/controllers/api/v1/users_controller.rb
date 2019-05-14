class Api::V1::UsersController < ApplicationController
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
    if @current_user.update(user_params)
      render json: @current_user, status: :accepted
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    @current_user.destroy
  end
  
  private
  
  def user_params
    params.permit(:username, :name)
  end
end
