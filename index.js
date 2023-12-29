const express = require('express')
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const socketRoutes = require('./routes/socketRoutes');
const router = require('./routes/router')

const app = express()
const port=3000
const server = http.createServer(app)
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'json')));
app.use(router)

io.on('connection', socketRoutes);
server.listen(port, () => console.log(`Server listening on port ${port}`));
