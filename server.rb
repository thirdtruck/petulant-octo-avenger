require 'sinatra'
require 'json'
require 'pp'
require 'base64'

image_data_url = nil

image_index = 1

set :public_folder, '.'

post '/upload_image' do
  data = request['image_data']
  image_data_url = data
  raw_base64 = data.gsub('data:image/png;base64,', '')
  image_data = Base64.decode64(raw_base64)
  File.open("uploaded_image_#{image_index}.png", 'w') do |file|
    file.write(image_data)
    image_index += 1
  end
  "posted #{data}"
end

get '/uploaded_image_src' do
  image_data_url || 'data:image/png;base64,'
end
