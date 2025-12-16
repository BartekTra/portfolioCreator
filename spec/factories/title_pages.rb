FactoryBot.define do
  factory :title_page do
    association :user
    template_key { "titleTemplate1" }
    phone { Faker::PhoneNumber.phone_number }
    email { Faker::Internet.email }
    address { Faker::Address.full_address }
    bio { Faker::Lorem.paragraph }
    experience { [] }
    sections { [] }
  end
end

