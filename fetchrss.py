import requests
import xml.etree.ElementTree as ET

# URL of the RSS feed
rss_url = "https://agilimo.de/feed/"

# Fetch the RSS feed
response = requests.get(rss_url)
response.raise_for_status()  # Will raise an error if the fetch fails

# Parse the RSS feed
root = ET.fromstring(response.content)

# Extract and print each item's title and link
for item in root.findall('.//item'):
    title = item.find('title').text
    link = item.find('link').text
    print(f"Title: {title}\nLink: {link}\n")