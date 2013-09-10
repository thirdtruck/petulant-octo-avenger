#!/usr/bin/env ruby

require 'sinatra'
require 'json'
require 'pp'
require 'base64'

image_data_url = nil

image_index = 1

set :public_folder, '.'

get '/' do
  redirect '/index.html'
end

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

# Handle POST-request (Receive and save the uploaded file)
post "/upload" do 
  File.open('uploads/' + params['myfile'][:filename], "w") do |file|
    file.write(params['myfile'][:tempfile].read)
  end
  redirect '/'
end

