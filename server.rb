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
  File.open('uploads/' + params['uploaded-image'][:filename], "w") do |file|
    file.write(params['uploaded-image'][:tempfile].read)
  end
  redirect '/'
end

get '/crop' do
  erb :crop
end

image_in_memory = ""
image_in_memory_name = ""

def image_tag_src(memory_image)
  data_uri = Base64.encode64(memory_image).gsub(/\n/, '')
  "data:image/jpeg;base64,#{data_uri}"
end

def image_tag(memory_image)
  "<img src='#{image_tag_src(memory_image)}' />"
end

post '/upload_memory' do
  pp params
  image_in_memory_name = params['uploaded-image'][:filename]
  image_in_memory = params['uploaded-image'][:tempfile].read
  redirect '/crop'
end

get '/uploaded_memory' do
  image_in_memory
end

get '/uploaded_memory_src' do
  content_type :png
  image_tag_src(image_in_memory)
end

get '/uploaded_memory_jpg' do
  image_tag(image_in_memory)
end

get '/uploaded_memory_png' do
  image_tag(image_in_memory)
end

get '/uploaded_memory_page' do
  "<!doctype html><html><body>#{image_tag(image_in_memory)}</body></html>"
end
