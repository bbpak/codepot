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

def fix_string(name)
  # - to whitespace
  if name.include?("-") 
    return name.gsub!("-", " ")
  # sharp/plus to # +
  elsif name == 'csharp'
    return 'c#'
  elsif name == 'fsharp'
    return 'f#'
  elsif name == 'cplusplus' || name == 'cpp'
    return 'c++'
  # trim js at end of js frameworks
  elsif name == 'angularjs'
    return 'angular'
  elsif name == 'vuejs'
    return 'vue'
  elsif name == 'reactjs'
    return 'react'
  else 
    return name
  end
end

# exclude some redundant tags
def excludes_redundant(name) 
  return [
    'js13kgames',
    'gamemaker',
    'game off',
    'global game jam',
    'windows8',
    'vuejs',
    'pixel vision 8',
    'pico 8',
    'liko 12',
    'perl',
    'open source',
    'ie10',
    'html5',
    'http',
    'hacktoberfest',
    'first tech challenge',
    'first robotics competition',
    'first',
    'fantasy console',
    'emoji',
    'es6',
    'css3'
  ].exclude?(name)
end

default_color = '#9896A4'

# Web scrape topics from GitHub topics
# url = 'https://github.com/github/explore/tree/master/topics'
# doc = Nokogiri::HTML(open(url))
# doc.css('td.content a.js-navigation-open').each do |a|
#   # And then get names and alises from the topics
#   url = "https://raw.githubusercontent.com/github/explore/master/topics/#{a.text}/index.md"
#   response = RestClient.get(url)

#   # Parse strings from md response
#   text = response.body

#   # Get aliases
#   # aliases = text[/#{"aliases: "}(.*?)#{"\\n"}/m, 1].gsub!(" ", "") 

#   # Get display name
#   display_name = text[/#{"display_name: "}(.*?)#{"\\n"}/m, 1]

#   # Get name
#   name = text[/#{"topic: "}(.*?)#{"\\n"}/m, 1]  

#   if (excludes_redundant(name))
#     tag = Tag.find_or_create_by!(name: display_name)
#   end
# end

# Web scrape from StackOverflow 2019 Developer Survey
# url = 'https://insights.stackoverflow.com/survey/2019'
# doc = Nokogiri::HTML(open(url))
# a = doc.css('#technology-most-popular-technologies-all-respondents-collapse').each do |a|
# end

# Web scrape topics from GitHub topics
url = 'https://github.com/github/explore/tree/master/topics'
doc = Nokogiri::HTML(open(url))
topics = doc.css('td.content a.js-navigation-open').each do |a|
  name = fix_string(a.text)

  if name && excludes_redundant(name)
    Tag.find_or_create_by!(name: name).update(color: default_color)
  end
end

# Also add tags from devicons since that what we use in the frontend
api_url = "https://raw.githubusercontent.com/konpa/devicon/master/devicon.json"
response = RestClient.get(api_url)
devicon_data = JSON.parse(response.body)

devicon_data.each do |tag|
  if !tag["tags"].to_set.intersect?(['manager','graphic','version-control','browser'].to_set)
    name = fix_string(tag["name"])

    if name && excludes_redundant(name)
      Tag.find_or_create_by!(name: name).update(color: default_color)
    end
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
    # Handle the specific inconsistencies
    if name == 'vuejs'
      name = 'vue'
    elsif name == 'angularjs'
      name = 'angular'
    end
    
    tag = Tag.find_by(name: name) 
    if tag
      tag.update!(color: color)
    end
  end
end
