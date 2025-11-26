class CreateProjects < ActiveRecord::Migration[7.2]
  def change
    create_table :projects do |t|
      t.jsonb :data
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
