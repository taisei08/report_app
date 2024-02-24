Aws::Rails.add_action_mailer_delivery_method(
  :ses,
  credentials: Aws::Credentials.new(ENV.fetch("SES_USERNAME"),
  ENV.fetch("SES_PASSWORD")),
  region: 'ap-northeast-1'
)