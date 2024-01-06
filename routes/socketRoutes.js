const socketMethods = require('../methods/socketMethods')

var socketRoutes = (socket) => {
    console.log('New client connected');

    socket.on('search', (query) => socketMethods.search(socket, query));
    socket.on('addFilter', (query) => socketMethods.addFilter(socket, query));
    socket.on('getBars', (type) => socketMethods.getBars(socket, type))
    socket.on('createFunc', (code) => socketMethods.createIndicator(socket, code))
    socket.on('scan', (data) => socketMethods.scan(socket, data))
    socket.on('backtest', (data) => socketMethods.backtest(socket, data))
    socket.on('getBarStats', () => socketMethods.getBarStats(socket))
    socket.on('setBarStats', () => socketMethods.setBarStats(socket))
    socket.on('searchTicker', (data) => socketMethods.searchTicker(socket, data))
    socket.on('getProbStockData', (data) => socketMethods.getProbStockData(socket, data))
    socket.on('getProbability', (data) => socketMethods.getProbability(socket, data))

    socket.on('disconnect', () => console.log('Client disconnected'));
}

module.exports=socketRoutes