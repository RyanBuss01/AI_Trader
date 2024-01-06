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
    resultsContainer.innerHTML = '';
    selectedStock = ticker;
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
    selectedStockDiv.innerHTML = ''; // Clear existing content
    let close = data.close;

    // Create and append the stock symbol text
    let selectedStockText = document.createElement('div');
    selectedStockText.textContent = `Symbol: ${selectedStock}`;
    selectedStockText.className = 'selectedStockText';
    selectedStockDiv.appendChild(selectedStockText); // Corrected this line

    // Create and append the current price text
    let closeContainer = document.createElement('div');
    closeContainer.className = 'selectedStockText';
    closeContainer.textContent = `Current Price: ${close}`;
    selectedStockDiv.appendChild(closeContainer); // Append the new element

    let hBar = data.haBar, trend, hColor
    if(hBar.OpenPrice == hBar.LowPrice) trend = 'Bullish'
    else if(hBar.OpenPrice == hBar.HighPrice) trend = 'Bearish'
    else trend = 'Neutral'
    let haTrend = document.createElement('div');
    haTrend.className = 'selectedStockText';
    haTrend.textContent = `HA Trend: ${trend}`;
    selectedStockDiv.appendChild(haTrend); 

    if(hBar.OpenPrice < hBar.ClosePrice) hColor = 'Green'
    else if(hBar.OpenPrice > hBar.ClosePrice) hColor = 'Red'
    else hColor = 'Neutral'
    let color = document.createElement('div');
    color.className = 'selectedStockText';
    color.textContent = `HA Color: ${hColor}`;
    selectedStockDiv.appendChild(color);

    let highBand = data.highBand, lowBand = data.lowBand
    let hBand = document.createElement('div');
    hBand.className = 'selectedStockText';
    hBand.textContent = `High Band: ${highBand}`;
    selectedStockDiv.appendChild(hBand);

    let lBand = document.createElement('div');
    lBand.className = 'selectedStockText';
    lBand.textContent = `Low Band: ${lowBand}`;
    selectedStockDiv.appendChild(lBand);

    let atrDiv = document.createElement('div');
    atrDiv.className = 'selectedStockText';
    atrDiv.textContent = `ATR: ${data.atr}`;
    selectedStockDiv.appendChild(atrDiv);
});

socket.on('getProbability', (data) => {
    resultsDiv.innerHTML = ''
    let probContainer = document.createElement('div');
    probContainer.className = 'selectedStockText';
    probContainer.textContent = `Probability: ${data}`;
    resultsDiv.appendChild(probContainer);
})

buildProbDiv();
socket.emit('getProbStockData', `SPY`);