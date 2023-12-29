let fullBars = []
let bars = []
var loaderText = document.getElementById('loadedText')

async function loadBars() {
    try {
        const response = await fetch('/bars.json');
        const data = await response.json();
        const response2 = await fetch('/bars2.json');
        const data2 = await response2.json();
        fullBars = data;
        fullBars.push(...data2)
        bars = fullBars.filter(s=> s.ticker == 'AAPL')[0].bars
    } catch (error) {
        console.error('Error fetching bars.json:', error);
    }
}

loadBars().then(() => {
    loaderText.textContent = "Content loaded"
})

