class CreateTitlePages < ActiveRecord::Migration[7.2]
  def change
    create_table :title_pages do |t|
      t.references :user, null: false, foreign_key: true
      t.string :phone
      t.string :email
      t.text :address
      t.text :bio
      t.jsonb :experience
      t.string :template_key, null: false, default: "titleTemplate1"
      
      t.timestamps
    end
    
    add_index :title_pages, :template_key
  end
end

