class AddTitlePageToRepositories < ActiveRecord::Migration[7.2]
  def change
    add_reference :repositories, :title_page, null: true, foreign_key: true
  end
end

