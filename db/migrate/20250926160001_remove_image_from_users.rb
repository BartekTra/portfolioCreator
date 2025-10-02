class RemoveImageFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :image
  end
end
