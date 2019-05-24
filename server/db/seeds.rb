# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


require 'open-uri'
require 'nokogiri'
require 'json'
require 'rest-client'

# Web scrape topics from GitHub topics
url = 'https://github.com/github/explore/tree/master/topics'
doc = Nokogiri::HTML(open(url))
topics = doc.css('td.content a.js-navigation-open').each do |a|
  Tag.find_or_create_by!(name: a.text)
end

# Also add tags from devicons since that what we use in the frontend
api_url = "https://raw.githubusercontent.com/konpa/devicon/master/devicon.json"
response = RestClient.get(api_url)
data = JSON.parse(response.body)

data.each do |tag|
  if tag["tags"].to_set.intersect?(['manager','graphic','version-control'].to_set)
    tag["tags"].each do |tagName|
      Tag.find_or_create_by!(name: tagName)
    end
  end
end