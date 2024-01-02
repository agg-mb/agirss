import requests
import xml.etree.ElementTree as ET
import re

# Function to extract image URL from description
def extract_image_url(description):
    match = re.search(r'<img.*?src="(.*?)"', description)
    return match.group(1) if match else None

# URL of the RSS feed
rss_url = "https://agilimo.de/feed/"

# Fetch the RSS feed
response = requests.get(rss_url)
response.raise_for_status()  # Will raise an error if the fetch fails

# Parse the RSS feed
root = ET.fromstring(response.content)

# Open a file to write the feed contents
with open('rss_content.txt', 'w') as file:
    for item in root.findall('.//item'):
        title = item.find('title').text
        link = item.find('link').text
        pub_date = item.find('pubDate').text if item.find('pubDate') is not None else 'No date'
        
        # Extract image URL from description
        description = item.find('description').text if item.find('description') is not None else ''
        image_url = extract_image_url(description)
        
        file.write(f"Title: {title}\nLink: {link}\nPublication Date: {pub_date}\nImage URL: {image_url}\n\n")
