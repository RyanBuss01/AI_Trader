const socket = io(window.parent.serverPath);
const searchBar = document.getElementById('searchBar');
const resultsContainer = document.getElementById('searchResults');

searchBar.addEventListener('input', () => {
    const query = searchBar.value;
    if (query === '') {
        resultsContainer.innerHTML = ''; 
        return;
    }
    socket.emit('searchTicker', query);
});