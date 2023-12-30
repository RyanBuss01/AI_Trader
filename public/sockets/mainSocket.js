const socket = io(window.parent.serverPath);

const resultsContainer = document.getElementById('searchResults');
const searchBar = document.getElementById('searchBar');
const filterCreater = document.getElementById('filterCreator');
const filtersContainer = document.getElementById('filtersContainer');
const scannerContainer = document.getElementById('scannerContainer');
const scannerResults = document.getElementById('scannerResults');
let scannerLoadingText = document.getElementById('scannerLoadingText')
let currentDisplayedItem = null;
let activeFilters = [];

// Logic to add filter
function createFilterHtml(jsonItem) {
    filterCreater.innerHTML = '';
    const newFilter = document.createElement('div');
    newFilter.classList.add('filter-section'); // Add a class for styling

    // Create and add the name label
    const nameLabel = document.createElement('div');
    nameLabel.textContent = jsonItem.name; // Assuming 'name' is a string
    nameLabel.classList.add('filter-name'); // Add a class for styling
    newFilter.appendChild(nameLabel);

    jsonItem.parameters.forEach(param => {
        if (param.type === 'dropdown') {
            let select = document.createElement('select');
            select.id = param.name;

            param.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.name;
                optionElement.textContent = option.label;
                optionElement.style = "display: block"
                select.appendChild(optionElement);
            });

            select.addEventListener('change', function(event) {
                const selectedValue = event.target.value;
                param.value = selectedValue
            });

            select = createInputLabelPair(param.label, select)

            newFilter.appendChild(select);
        } else if (param.type === 'number') {
            let input = document.createElement('input');
            input.type = 'number';
            input.id = param.name;
            input.placeholder = param.label;
            input.value = param.default; // Assuming 'Default' is the default value
            input.addEventListener('change', function(event) {
                const inputValue = event.target.value;
                param.value = inputValue
            });
            input.style = "display: block"

            input = createInputLabelPair(param.label, input)

            newFilter.appendChild(input);
        } else if (param.type === 'bool') {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = param.name;
            checkbox.checked = param.default; 
            checkbox.addEventListener('change', function(event) {
                const inputValue = event.target.checked;
                param.value = inputValue
            });
            let newInput = createInputLabelPair(param.label, checkbox)
            newInput.style = "display: block"
            newFilter.appendChild(newInput);
        } 
        // Add other parameter types as needed
    });

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Filter';
    addButton.classList.add('add-filter-btn'); // Add a class for styling
    addButton.addEventListener('click', () => {
       addFilter(jsonItem)
    });



    newFilter.appendChild(addButton);

    filterCreater.appendChild(newFilter);
}

function searchResultClick (result) {
    searchBar.value = '';
    resultsContainer.innerHTML = '';
    socket.emit('addFilter', result)
} 

function addFilter(jsonItem) {
    activeFilters.push(jsonItem);
    updateFiltersUI();
    filterCreater.innerHTML = '';
    currentDisplayedItem = null
}

function updateFiltersUI() {
    filtersContainer.innerHTML = ''; // Clear existing filters

    activeFilters.forEach((filterItem, i) => {
        creatActiveFilterHtml(filterItem, i);
    });

    if(activeFilters.length>0) {
        showScannerButtons()
    } else {
        scannerContainer.innerHTML = ""
    }
}

function creatActiveFilterHtml(jsonItem, i) {
    const filterDisplay = document.createElement('div');
    filterDisplay.classList.add('filter-display'); // Add a class for styling

    // Display the name of the filter
    const filterName = document.createElement('h3');
    filterName.textContent = jsonItem.label;

    const deleteButton = document.createElement('button')
    deleteButton.className = "red-x-button"
    deleteButton.innerHTML="X"
    deleteButton.addEventListener('click', ()=>{
        activeFilters.splice(i, 1)
        updateFiltersUI()
    })
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('filter-header'); // Add a class for styling

    // Append filterName and deleteButton to the headerContainer
    headerContainer.appendChild(filterName);
    headerContainer.appendChild(deleteButton);
    filterDisplay.appendChild(headerContainer)

    // Display each parameter of the filter
    jsonItem.parameters.forEach(param => {
        const paramDisplay = document.createElement('div');
        let val = (param.value !== undefined && param.value !== null) ? param.value : param.default
        paramDisplay.textContent = `${param.label}: ${val}`;
        filterDisplay.appendChild(paramDisplay);
    });

    // Append this new filter display to the filters container
    filtersContainer.appendChild(filterDisplay);
}

function createInputLabelPair(text, input) {
    var label = document.createElement('label');
    label.textContent = text;
    label.className = 'label-input-pair'; 
    label.appendChild(input);
    input.className = 'param-input'
    return label;
}

function showScannerButtons () {
    scannerContainer.innerHTML = ""
    
    var scanButton = document.createElement('button')
    scanButton.textContent = "Run Scan"
    scanButton.className = "scanButton"
    scanButton.addEventListener('click', ()=>scan())

    var backtestButton = document.createElement('button')
    backtestButton.textContent = "Run Backtest"
    backtestButton.className = "scanButton"
    backtestButton.addEventListener('click', ()=>backtest())



    scannerContainer.appendChild(scanButton)
    scannerContainer.appendChild(backtestButton)
}

function scan() {
    scannerResults.innerHTML = ''
    scannerLoadingText.textContent= `Running Scan`
    socket.emit('scan', activeFilters)
}

function backtest() {
    scannerResults.innerHTML = ''
    scannerLoadingText.textContent= `Running BackTest`
    let data = {
        data: activeFilters,
        sellPeriod: 10,
        sellType: 'precent',
        sellVar: 0.01,
        backtestPeriod: 600
    }
    socket.emit('backtest', data) 
}

function createTextHeader(text) {
    var header =  document.createElement('div')
    header.className = "scannerHeader"
    header.textContent = text
    return header
}

searchBar.addEventListener('input', () => {
    const query = searchBar.value;
    if (query === '') {
        resultsContainer.innerHTML = ''; 
        return;
    }
    socket.emit('search', query);
});

socket.on('connect', () => console.log('Connected to server'));
socket.on('addFilter', (jsonItem) => createFilterHtml(jsonItem))
socket.on('scanLoading', (data) => scannerLoadingText.textContent= `${data[0]} / ${data[1]} iterations complete`)

socket.on('searchResults', (results) => {
    resultsContainer.innerHTML = ''; // Clear previous results

    results.forEach(result => {
        if (result !== currentDisplayedItem) { // Check if result is not the current displayed item
            const resultItem = document.createElement('div');
            resultItem.textContent = result.label;
            resultItem.classList.add('clickable-result');
            resultItem.addEventListener('click', () => searchResultClick(result));
            resultsContainer.appendChild(resultItem);
        }
    });
});

socket.on('scan', (data) => {
    scannerLoadingText.textContent= ``
    scannerResults.innerHTML = ''
    var containerBullBuy = document.createElement('div')
    var containerBearBuy = document.createElement('div')
    var containerBullSell = document.createElement('div')
    var containerBearSell = document.createElement('div')

    containerBullBuy.className = "scannerSectionContainer"
    containerBearBuy.className = "scannerSectionContainer"
    containerBullSell.className = "scannerSectionContainer"
    containerBearSell.className = "scannerSectionContainer"

    for(let s of data) {
        var stockContainer = document.createElement('div')
        stockContainer.className ='stock-result-display'

        var stockSymbol = document.createElement('div')
        stockSymbol.textContent = `Symbol: ${s.sym}`

        var alertText = document.createElement('div')
        alertText.textContent = `Alert: ${s.alert}`

        stockContainer.appendChild(stockSymbol)
        stockContainer.appendChild(alertText)

        if (s.alert.includes("bullBuy")) containerBullBuy.appendChild(stockContainer.cloneNode(true))
        if (s.alert.includes("bearBuy")) containerBearBuy.appendChild(stockContainer.cloneNode(true))
        if (s.alert.includes("bullSell")) containerBullSell.appendChild(stockContainer.cloneNode(true))
        if (s.alert.includes("bearSell")) containerBearSell.appendChild(stockContainer.cloneNode(true))

    }

    const length = data.length
    var dataContainer = document.createElement('div')
    dataContainer.textContent = `Number of Alerts: ${length}`
    dataContainer.style = "display: block"


    scannerResults.appendChild(dataContainer)

    if(data.some(s=> s.alert.includes("bullBuy"))) scannerResults.appendChild(createTextHeader('Bullish Buy alerts'))
    scannerResults.appendChild(containerBullBuy)
    if(data.some(s=> s.alert.includes("bearBuy"))) scannerResults.appendChild(createTextHeader('Bearish Buy alerts'))
    scannerResults.appendChild(containerBearBuy)
    if(data.some(s=> s.alert.includes("bullSell"))) scannerResults.appendChild(createTextHeader('Bullish Sell alerts'))
    scannerResults.appendChild(containerBullSell)
    if(data.some(s=> s.alert.includes("bearSell"))) scannerResults.appendChild(createTextHeader('Bearish Sell alerts'))
    scannerResults.appendChild(containerBearSell)

    socket.emit('setBarStats')
})


