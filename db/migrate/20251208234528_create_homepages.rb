class CreateHomepages < ActiveRecord::Migration[7.2]
  def change
    create_table :homepages do |t|
      t.references :user, null: false, foreign_key: true
      t.string :phone
      t.string :email
      t.text :address
      t.text :bio
      t.jsonb :experience
      t.jsonb :skills
      t.jsonb :education
      t.jsonb :social_links

      t.timestamps
    end
  end
end
