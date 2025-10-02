class ReplaceNameWithTwoSeparateNameColumns < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :name, :string
    add_column :users, :first_name, :string
    add_column :users, :surname, :string
  end
end
