/* Automatic scrolling */
const rssfeed = document.getElementById('rssfeed');
let scrollDirection = 1; // 1 for downward, -1 for upward
const scrollSpeed = 1; // Adjust for faster or slower scroll

// Function to fetch and display RSS content
function fetchAndDisplayRSS() {
    fetch('rss_content.txt')
        .then(response => response.text())
        .then(data => {
            const contentDiv = document.getElementById('rssfeed');
            // Split the content by double newline to separate each RSS item
            const items = data.split('\n\n');
            let htmlContent = '';
            items.forEach(item => {
                // Split each item by newline to get individual fields
                const fields = item.split('\n');
                htmlContent += `<article>`;
                fields.forEach(field => {
                    htmlContent += `<p>${field}</p>`;
                });
                htmlContent += `</article>`;
            });
            contentDiv.innerHTML = htmlContent;
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