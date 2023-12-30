const socket = io(window.parent.serverPath);
const searchBar = document.getElementById('searchBar');
const resultsContainer = document.getElementById('searchResults');
const selctedStockDiv = document.getElementById('selectedStock');
let currentDisplayedItem = null;
let selectedStock = null

let searchResultClick = (ticker) => {
    searchBar.value = '';
    resultsContainer.innerHTML = '';
    selectedStock = ticker
    build()
}

let build = () => {
    if(selectedStock == null) {
        selctedStockDiv.innerHTML =  ''
    }
    else {
        let stockName = document.createElement('div')
        selctedStockDiv.appendChild(stockName)
    }

}

searchBar.addEventListener('input', () => {
    const query = searchBar.value;
    if (query === '') {
        resultsContainer.innerHTML = ''; 
        return;
    }
    socket.emit('searchTicker', query);
});

socket.on('searchResults', (results) => {
    resultsContainer.innerHTML = ''; // Clear previous results
    results.forEach(result => {
        if (result !== currentDisplayedItem) { // Check if result is not the current displayed item
            const resultItem = document.createElement('div');
            resultItem.textContent = result;
            resultItem.classList.add('clickable-result');
            resultItem.addEventListener('click', () => searchResultClick(result));
            resultsContainer.appendChild(resultItem);
        }
    });
});