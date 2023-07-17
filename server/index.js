const express = require('express')
const app = express()
const PORT = 8080
const cors = require('cors')
const http = require('http')

const server = http.createServer(app)

const socketIO = require('socket.io')(server,{
    cors:{
        origin: 'http://localhost:3000',
    }
})  


let users =[] 

socketIO.on('connection', (socket) => {
    console.log(`🔥: ${socket.id} user just connected`)

    socket.on('newUser', (data) => {
        users.push(data)
        socketIO.emit('newUserResponce', users)
    })

    socket.on('disconnect', () => {
        console.log('A user just got disconnected')
        users = users.filter(user => user.socketID !== socket.id)
        socketIO.emit('newUserResponce', users)
    })
    socket.on('message',(data)=>{
        console.log(data)
        socketIO.emit('messageResponse', data)
    })
 
})


app.use(cors())

app.get('/api', (req,res) => {
    res.send('Hello World')
})


server.listen(PORT, () => {
    console.log('Server started at ' + PORT)
})
//dont start on 3000 port because our client files are running on that
