class ApplicationMailer < ActionMailer::Base
  default from: (ENV["MAILER_FROM"].presence || "noreply@portfolio-creator.com")
  layout "mailer"
end
