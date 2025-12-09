class CreateRepositoryProjects < ActiveRecord::Migration[7.2]
  def change
    create_table :repository_projects do |t|
      t.references :repository, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end
    
    add_index :repository_projects, [:repository_id, :position]
    # Unikalność: jeden projekt może być tylko raz w repozytorium
    add_index :repository_projects, [:repository_id, :project_id], unique: true
  end
end
