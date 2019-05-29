class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :display_name
      t.string :repo_url
      t.string :project_url
      t.string :image_url
      t.integer :user_id
      t.string :description
      
      t.timestamps
    end
  end
end
