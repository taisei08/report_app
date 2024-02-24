CarrierWave.configure do |config|
  if Rails.env.production?
    config.asset_host = ENV.fetch('BACKEND_URL', 'http://localhost:3010')
    config.storage :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory  = ENV.fetch("BUCKET_CARRIERWAVE"),
    config.fog_public = false
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV.fetch("S3_USERNAME"),
      aws_secret_access_key: ENV.fetch("S3_PASSWORD"),
      region: 'ap-northeast-1',
      path_style: true
    }
  else
    config.asset_host = ENV.fetch('BACKEND_URL', 'http://localhost:3010')
    config.storage = :file
    config.cache_storage = :file
  end
end

  
  