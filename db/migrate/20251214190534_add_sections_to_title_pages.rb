class AddSectionsToTitlePages < ActiveRecord::Migration[7.2]
  def change
    add_column :title_pages, :sections, :jsonb
  end
end
