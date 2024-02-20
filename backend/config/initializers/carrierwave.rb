CarrierWave.configure do |config|
    config.asset_host = ENV.fetch('BACKEND_URL', 'http://localhost:3010')
    config.storage = :file
    config.cache_storage = :file
  end