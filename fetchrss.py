import requests
import xml.etree.ElementTree as ET

# URL of the RSS feed
rss_url = "https://agilimo.de/feed/"

# Fetch the RSS feed
response = requests.get(rss_url)
response.raise_for_status()

# Parse the RSS feed
root = ET.fromstring(response.content)

# Open a file to write the feed contents
with open('rss_content.txt', 'w') as file:
    for item in root.findall('.//item'):
        title = item.find('title').text
        link = item.find('link').text
        file.write(f"Title: {title}\nLink: {link}\n\n")
