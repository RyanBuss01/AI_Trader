const socket = io(window.parent.serverPath);

const buttonGetBars = document.getElementById('getBars');
const buttonRefreshBars = document.getElementById('refreshBars');
const barGetterText = document.getElementById('barGetterText');
const barStatsText = document.getElementById('barStats')

socket.emit('getBarStats')

buttonGetBars.addEventListener('click', () =>{
    socket.emit('getBars', 'full')
})

buttonRefreshBars.addEventListener('click', () => {
    socket.emit('getBars', 'refresh')
})

socket.on('getBarsComplete', () => {
    barGetterText.textContent = `Bars Complete`
})

socket.on('barGetter', (query) => {
    let index = query.index, length = query.length

    barGetterText.textContent = `Iteration ${index} / ${length}`
})

socket.on('getBarStats', (data) => {
    barStatsText.textContent=data
})