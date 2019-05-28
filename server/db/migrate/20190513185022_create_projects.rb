class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :repo_url
      t.string :project_url
      t.string :image_url
      t.integer :user_id
      t.string :description
      t.string :full_name
      
      t.timestamps
    end
  end
end
