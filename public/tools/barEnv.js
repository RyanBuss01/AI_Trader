let fullBars = []
let bars = []
let data = []
var loaderText = document.getElementById('loadedText')

async function loadBars() {
    try {
        const response = await fetch('/bars.json');
        const json = await response.json();
        const response2 = await fetch('/bars2.json');
        const json2 = await response2.json();
        fullBars = json;
        fullBars.push(...json2)
        bars = fullBars.filter(s=> s.ticker == 'AAPL')[0].bars
        data = bars.map(b=>b.ClosePrice)
    } catch (error) {
        console.error('Error fetching bars.json:', error);
    }
}

loadBars().then(() => {
    loaderText.textContent = "Content loaded"
})

