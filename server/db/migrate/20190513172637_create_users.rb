class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :username
      t.string :name
      t.integer :github_id
      t.integer :tokens
      t.timestamps
    end
  end
end
