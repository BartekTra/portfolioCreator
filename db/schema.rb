# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_12_12_195021) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "homepages", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "phone"
    t.string "email"
    t.text "address"
    t.text "bio"
    t.jsonb "experience"
    t.jsonb "skills"
    t.jsonb "education"
    t.jsonb "social_links"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_homepages_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.jsonb "data"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "template_key", default: "templateA", null: false
    t.index ["template_key"], name: "index_projects_on_template_key"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "repositories", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "title_page_id"
    t.string "public_share_token"
    t.index ["public_share_token"], name: "index_repositories_on_public_share_token"
    t.index ["title_page_id"], name: "index_repositories_on_title_page_id"
    t.index ["user_id"], name: "index_repositories_on_user_id"
  end

  create_table "repository_projects", force: :cascade do |t|
    t.bigint "repository_id", null: false
    t.bigint "project_id", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_repository_projects_on_project_id"
    t.index ["repository_id", "position"], name: "index_repository_projects_on_repository_id_and_position"
    t.index ["repository_id", "project_id"], name: "index_repository_projects_on_repository_id_and_project_id", unique: true
    t.index ["repository_id"], name: "index_repository_projects_on_repository_id"
  end

  create_table "title_pages", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "phone"
    t.string "email"
    t.text "address"
    t.text "bio"
    t.jsonb "experience"
    t.string "template_key", default: "titleTemplate1", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["template_key"], name: "index_title_pages_on_template_key"
    t.index ["user_id"], name: "index_title_pages_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "nickname"
    t.string "email"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "surname"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "homepages", "users"
  add_foreign_key "projects", "users"
  add_foreign_key "repositories", "title_pages"
  add_foreign_key "repositories", "users"
  add_foreign_key "repository_projects", "projects"
  add_foreign_key "repository_projects", "repositories"
  add_foreign_key "title_pages", "users"
end
