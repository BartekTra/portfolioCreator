FactoryBot.define do
  factory :repository do
    association :user
    association :title_page
    name { Faker::Lorem.words(number: 2).join(" ") }
    description { Faker::Lorem.sentence }
  end
end

