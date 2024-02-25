Aws::Rails.add_action_mailer_delivery_method(
  :ses,
  credentials: Aws::Credentials.new(ENV.fetch("SES_USERNAME", nil),
  ENV.fetch("SES_PASSWORD", nil)),
  region: 'ap-northeast-1'
)