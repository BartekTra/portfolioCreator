class CreateRepositories < ActiveRecord::Migration[7.2]
  def change
    create_table :repositories do |t|
      t.string :name, null: false
      t.text :description
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
