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
require 'yaml'
require 'rest-client'
require 'css_parser'

# This is where I create tags of languages, frameworks, and libraries
# and the respective colors assciated with them by web scraping /
# using API/raw json files from several different sources

default_color = '#9896A4'

# Web scrape topics from GitHub topics
url = 'https://github.com/github/explore/tree/master/topics'
doc = Nokogiri::HTML(open(url))
topics = doc.css('td.content a.js-navigation-open').each do |a|
  name = a.text.include?("-") ? a.text.gsub!("-", " ") : a.text
  Tag.find_or_create_by!(name: name, color: default_color)
end

# Also add tags from devicons since that what we use in the frontend
api_url = "https://raw.githubusercontent.com/konpa/devicon/master/devicon.json"
response = RestClient.get(api_url)
devicon_data = JSON.parse(response.body)

devicon_data.each do |tag|
  if !tag["tags"].to_set.intersect?(['manager','graphic','version-control'].to_set)
      Tag.find_or_create_by!(name: tag["name"], color: default_color)
  end
end

# Get associated colors for languages
api_url = "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
response = RestClient.get(api_url)
lang_data = YAML.parse(response.body).to_ruby()

lang_data.each do |lang|
  tag = Tag.find_by(name: lang[0].downcase)
  color = lang[1]["color"] 
  if tag && color 
    tag.update!(color: color)
  end
end
  
# Get colors from devicon css, then parse css and add the associated colors
parser = CssParser::Parser.new
parser.load_uri!("https://raw.githubusercontent.com/konpa/devicon/master/devicon-colors.css")
parser.each_selector do |selector, dec, spec|
  name = selector.split('-')[1]
  color = dec[/#{"color: "}(.*?)#{";"}/m, 1]
  if name && color 
    tag = Tag.find_by(name: name) 
    if (tag)
      tag.update!(color: color)
    end
  end
end
