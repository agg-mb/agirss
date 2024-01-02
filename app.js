    // Function to fetch and display RSS content
    function fetchAndDisplayRSS() {
        fetch('rss_content.txt')
            .then(response => response.text())
            .then(data => {
                const contentDiv = document.getElementById('rss-content');
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
