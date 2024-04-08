/* Automatic scrolling */
const rssfeed = document.getElementById('rssfeed');
let scrollDirection = 1; // 1 for downward, -1 for upward
const scrollSpeed = 1; // Adjust for faster or slower scroll

// Function to fetch and display RSS content
function fetchAndDisplayRSS() {
    fetch('rss_content.txt')
        .then(response => response.text())
        .then(data => {
            const contentDiv = document.getElementById('rssfeed'); // This should be the element where you want to display the RSS content
            const items = data.split('\n\n');
            let htmlContent = ''; // Initialize the variable to store the HTML content

            items.forEach((item, index) => {
                const fields = item.split('\n');
                let itemHtml = '<div class="rss-item">';
                let link = '', title = '', pubDate = ''; // Declare variables to ensure they are not globally scoped
                fields.forEach(field => {
                    if (field.startsWith('Title: ')) {
                        title = field.replace('Title: ', '');
                        itemHtml += '<h1>' + title + '</h1>';
                    } else if (field.startsWith('Publication Date: ')) {
                        pubDate = field.replace('Publication Date: ', '');
                    } else if (field.startsWith('Image URL: ') && !field.includes('None')) {
                        const imageUrl = field.replace('Image URL: ', '');
                        itemHtml += '<img src="' + imageUrl + '" alt="RSS Image">';
                    } else if (field.startsWith('Link: ')) {
                        link = field.replace('Link: ', '');
                        itemHtml += '<a href="' + link + '">' + link + '</a>';
                    } else if (field.startsWith('Description: ')) {
                        const description = field.replace('Description: ', '');
                        itemHtml += '<p>' + description + '</p>';
                    }
                });
                if (pubDate) {
                    itemHtml = itemHtml.replace('<h1>' + title + '</h1>', '<h1>' + title + '</h1><p>' + pubDate + '</p>');
                }
                // Add QR code container with unique ID
                const qrCodeContainerId = 'qrcode-' + index;
                itemHtml += '<div id="' + qrCodeContainerId + '"></div>';
                itemHtml += '</div>';
                htmlContent += itemHtml; // Append the item's HTML to the htmlContent variable
            });
            contentDiv.innerHTML = sanitizeHTML(htmlContent); // Set the innerHTML of the content div

            // Generate QR codes
            items.forEach((item, index) => {
                const qrCodeContainerId = 'qrcode-' + index;
                const linkField = item.split('\n').find(field => field.startsWith('Link: '));
                const link = linkField ? linkField.replace('Link: ', '') : '';
                if (link) {
                    new QRCode(document.getElementById(qrCodeContainerId), {
                        text: link,
                        width: 128,
                        height: 128
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching the RSS content:', error));
}

// Call the function when the window loads
window.onload = fetchAndDisplayRSS;

/* Automatically scrolling */
function autoScroll() {
    if (rssfeed.scrollHeight <= rssfeed.clientHeight) {
        // If all content is visible, no need to scroll
        return;
    }

    // Check if we've scrolled to the bottom
    if (rssfeed.scrollTop + rssfeed.clientHeight >= rssfeed.scrollHeight) {
        scrollDirection = -1;
    }
    // Check if we've scrolled back to the top
    else if (rssfeed.scrollTop === 0) {
        scrollDirection = 1;
    }

    rssfeed.scrollTop += scrollSpeed * scrollDirection;
}

setInterval(autoScroll, 100); // Adjust interval for faster or slower scroll

function refreshPage() {
    window.location.reload();
}

setTimeout(refreshPage, 900000); // 900000 milliseconds = 15 minutes

function sanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.innerHTML = str;

    // Allowable tags and attributes
    var safe_tags = ['a', 'b', 'i', 'em', 'strong', 'p', 'ul', 'li', 'h1', 'h2', 'h3', 'br', 'span', 'div'];
    var safe_attrs = ['href', 'title', 'style', 'target', 'rel', 'class', 'id'];

    // Remove script tags and event handlers
    var elements = temp.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = element.attributes.length - 1; j >= 0; j--) {
            var attribute = element.attributes[j];
            if (safe_attrs.indexOf(attribute.name.toLowerCase()) === -1 || attribute.name.startsWith('on')) {
                element.removeAttribute(attribute.name);
            }
        }
        if (safe_tags.indexOf(element.tagName.toLowerCase()) === -1) {
            element.parentNode.replaceChild(document.createTextNode(element.outerHTML), element);
        }
    }
    return temp.innerHTML; // return sanitized HTML
}

/*
document.addEventListener('click', function(event) {
    // Prevent default action for all clicks except those on the scrollbar
    event.preventDefault();
}, true);
*/
