class AddPublicShareTokenToRepositories < ActiveRecord::Migration[7.2]
  def change
    add_column :repositories, :public_share_token, :string
    add_index :repositories, :public_share_token
  end
end
