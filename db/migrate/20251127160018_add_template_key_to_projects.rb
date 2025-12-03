class AddTemplateKeyToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :template_key, :string, null: false, default: "templateA"
    add_index :projects, :template_key
  end
end
