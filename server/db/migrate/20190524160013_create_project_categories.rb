class CreateProjectCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :project_categories do |t|
      t.integer :category_id
      t.integer :project_id
    end
  end
end
