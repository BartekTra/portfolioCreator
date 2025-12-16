FactoryBot.define do
  factory :repository_project do
    association :repository
    association :project
    position { 0 }
  end
end

