document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('song-form');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const songs = Array.from({ length: 5 }, (_, i) => 
            document.getElementById(`song${i + 1}`).value.trim()
        ).filter(Boolean);

        resultsDiv.innerHTML = '<p>Searching for your songs...</p>'; 

        fetch('http://localhost/learn-guitar-songs/public/api.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({songs})
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data from server:", data);
            resultsDiv.innerHTML = '';

            if (data.youtube_links && data.thumbnails && data.tab_links) {
                data.youtube_links.forEach((youtubeLink, index) => {
                    const songResult = document.createElement('div');
                    songResult.className = 'song-result';
                    
                    songResult.innerHTML = `
                        <p><strong>${songs[index]}</strong></p>
                        <img src="${data.thumbnails[index]}" alt="Thumbnail" style="width: 120px; height: auto;">
                        <p><a href="${youtubeLink}" target="_blank">YouTube Guitar Lesson</a></p>
                        <p><a href="${data.tab_links[index]}" target="_blank">Guitar Tab</a></p>
                    `;
                    resultsDiv.appendChild(songResult);
                });
            } else {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = '<p>An error occurred. Please try again.</p>';
            console.error('Error:', error);
        });
    });
});
