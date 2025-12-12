class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "noreply@portfolio-creator.com")
  layout "mailer"
end
