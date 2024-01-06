
    
    // Refactor the AJAX call into a function
    function loadContent(url) {
        // Clear existing content
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '';
    
        // AJAX request to load new content
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Set new content
                contentDiv.innerHTML = xhr.responseText;
    
                // Find and execute script tags in the new content
                Array.from(contentDiv.querySelectorAll('script')).forEach(originalScript => {
                    var scriptCopy = document.createElement('script');
                    if (originalScript.src) {
                        // External script
                        scriptCopy.src = originalScript.src;
                        scriptCopy.onload = () => originalScript.remove();
                    } else {
                        // Inline script
                        scriptCopy.textContent = originalScript.textContent;
                        originalScript.remove();
                    }
                    document.head.appendChild(scriptCopy);
                });
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }
    
    // Add click event listener for nav links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                var url = this.getAttribute('href'); // Get the URL of the clicked link
                document.getElementById('contentFrame').src = url; // Load the content into the iframe
            });
        });

        // Optionally, load the default page into the iframe
        document.getElementById('contentFrame').src = 'probability.html';
    
