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

image_in_memory = nil
image_in_memory_name = nil

post '/upload_memory' do
  image_in_memory_name = params['myfile'][:filename]
  image_in_memory = params['myfile'][:tempfile].read
  "uploaded #{image_in_memory_name}"
end

get '/uploaded_memory' do
  image_in_memory
  data_uri = Base64.encode64(image_in_memory).gsub(/\n/, '')
  image_tag = "<img src='data:image/jpeg;base64,#{data_uri} />"
  iamge_tag
end

get '/uploaded_memory_jpg' do
  data_uri = Base64.encode64(image_in_memory).gsub(/\n/, '')
  image_tag = "<img src='data:image/jpeg;base64,#{data_uri} />"
  iamge_tag
end

get '/uploaded_memory_png' do
  data_uri = Base64.encode64(image_in_memory).gsub(/\n/, '')
  image_tag = "<img src='data:image/png;base64,#{data_uri} />"
  iamge_tag
end
