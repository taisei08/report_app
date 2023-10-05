CarrierWave.configure do |config|
    config.asset_host = "http://localhost:3010"
    config.storage = :file
    config.cache_storage = :file
  end