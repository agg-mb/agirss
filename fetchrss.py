import datetime
import locale
import xml.etree.ElementTree as ET
import requests
import re

from datetime import datetime
from pytz import timezone
from babel.dates import format_date, format_time, get_timezone

# Function to convert and format date to Berlin timezone in German
def format_date_to_berlin_time(date_string):
    original_format = '%a, %d %b %Y %H:%M:%S %z'
    berlin = timezone('Europe/Berlin')
    date_obj = datetime.strptime(date_string, original_format)
    date_obj_berlin = date_obj.astimezone(berlin)

    # Format date and time separately
    formatted_date = format_date(date_obj_berlin, format='full', locale='de_DE')
    formatted_time = format_time(date_obj_berlin, format='short', locale='de_DE', tzinfo=get_timezone('Europe/Berlin'))

    return f"{formatted_date} {formatted_time} Uhr"

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

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
        pub_date = format_date_to_berlin_time(pub_date) if item.find('pubDate') != 'No date' else 'No date'

        # Extract URL from description
        description = item.find('description').text if item.find('description') is not None else ''

        # Clean HTML tags from description
        clean_description = clean_html(description)

        file.write(f"Title: {title}\nLink: {link}\nPublication Date: {pub_date}\nDescription: {clean_description}\n\n")