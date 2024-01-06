const socket = io(window.parent.serverPath);
let selectedStockDiv = document.getElementById('selectedStock');
let resultsContainer = document.getElementById('searchResults');
let probSelect = document.getElementById('probSelect');
let probDiv = document.getElementById('probDiv');
let resultsDiv = document.getElementById('resultsDiv');

let selectedData
let period
let selectedStock = 'SPY';


runData = () => {
    socket.emit('getProbability', {stock: selectedStock, data: selectedData, period: period});
}

buildProbDiv = () => {
    probDiv.innerHTML = '';
    let prob = probSelect.value;
    if (prob === 'price') {
        let probContainer = document.createElement('div');
        probContainer.textContent = 'Price Input: ';
        let priceInput = document.createElement('Input');
        priceInput.setAttribute('type', 'number');
        priceInput.setAttribute('id', 'priceInput');
        priceInput.addEventListener('input', () => selectedData = priceInput.value);
        let periodInputText = document.createElement('div');
        periodInputText.textContent = 'Period Input: ';
        let periodInput = document.createElement('Input');
        periodInput.setAttribute('type', 'number');
        periodInput.setAttribute('id', 'priceInput');
        periodInput.addEventListener('input', () => period = periodInput.value);
        let runButton = document.createElement('button');
        runButton.textContent = 'Run';
        runButton.addEventListener('click', () => runData());
        probDiv.appendChild(probContainer);
        probDiv.appendChild(priceInput);
        probDiv.appendChild(periodInputText);
        probDiv.appendChild(periodInput);
        probDiv.appendChild(runButton);
    }
    
}  

let searchResultClick = (ticker) => {
    selectedStock = ticker;
    selectedStockDiv.textContent = ticker;
    resultsContainer.innerHTML = '';
    socket.emit('getProbStockData', ticker);
}

probSelect.addEventListener('change', () =>  buildProbDiv())

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
        if (result !== selectedStock) { // Check if result is not the current displayed item
            const resultItem = document.createElement('div');
            resultItem.textContent = result;
            resultItem.classList.add('clickable-result');
            resultItem.addEventListener('click', () => searchResultClick(result));
            resultsContainer.appendChild(resultItem);
        }
    });
});

socket.on('getProbStockData', (data) => {
    let close = data.close;
    let closeContainer = document.createElement('div')
    closeContainer.textContent = close;
    selectedStockDiv.appendChild(closeContainer);
});

socket.on('getProbability', (data) => {
    resultsDiv.innerHTML = ''
    let probContainer = document.createElement('div');
    probContainer.className = 'selectedStock';
    probContainer.textContent = data;
    resultsDiv.appendChild(probContainer);
})

buildProbDiv();
socket.emit('getProbStockData', selectedStock);