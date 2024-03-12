const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')

const { userConnect, userDisconnect } = require('./users')

const app = express();
const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, 'client')));

const PORT = process.env.PORT || 9999;

httpServer.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));

const io = new Server(httpServer);


// socket.emit - skickar eventet till den specifika socketen
// io.emit - skickar event till ALLA sockets som är anslutna
// socket.broadcast.emit - skicka event till alla andra sockets som är anslutna 

io.on('connection', socket => {

    socket.on('user', (userName) => {
        userConnect(socket.id, userName)
        socket.broadcast.emit('new_user_connection', `${userName} has entered the chat`)
    })

    socket.on('message', message => {
        //message.createdAt: Date.now()
        io.emit('new_message', message)
    })

    socket.on('typing', userName => {
        socket.broadcast.emit('typing', userName)
    })

    socket.on('disconnect', () => {
        const user = userDisconnect(socket.id)
        io.emit('new_user_connection', `${user.userName} has left the chat`)
    })
    
})