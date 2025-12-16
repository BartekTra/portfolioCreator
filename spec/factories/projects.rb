FactoryBot.define do
  factory :project do
    association :user
    template_key { "templateA" }
    data do
      {
        "sections" => [
          {
            "id" => 1234567890,
            "type" => "title",
            "value" => "Test Project",
            "order" => 0
          },
          {
            "id" => 1234567891,
            "type" => "description",
            "value" => "Test Description",
            "order" => 1
          }
        ],
        "template_key" => "templateA"
      }
    end
  end
end

