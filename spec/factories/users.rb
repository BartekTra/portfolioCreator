FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { "password123" }
    password_confirmation { "password123" }
    first_name { Faker::Name.first_name }
    surname { Faker::Name.last_name }
    nickname { Faker::Internet.username }
    uid { email }
    provider { "email" }
    confirmed_at { Time.current }
    
    trait :unconfirmed do
      confirmed_at { nil }
      confirmation_token { Devise.friendly_token }
      confirmation_sent_at { Time.current }
    end
  end
end

