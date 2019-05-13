class CreateProjectLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :project_likes do |t|
      t.integer :project_id
      t.integer :user_id

      t.timestamps
    end
  end
end
