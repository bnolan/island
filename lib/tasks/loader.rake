namespace :db do
  namespace :fixtures do
    desc "Load images into database using paperclip plugin"
    task :loader => :load do
      require 'active_record/fixtures'
      ActiveRecord::Base.establish_connection(RAILS_ENV.to_sym)
      
      Dir.glob("#{RAILS_ROOT}/test/fixtures/images/*.png").each do |filename|
        Asset.create! :upload => File.new(filename), :name => filename.sub(/.+\//,'')
        # r.image.reprocess!
        # r.save
      end
    end
  end
end