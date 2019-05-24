class CreateProjectTags < ActiveRecord::Migration[5.2]
  def change
    create_table :project_tags do |t|
      t.integer :tag_id
      t.integer :project_id
    end
  end
end
