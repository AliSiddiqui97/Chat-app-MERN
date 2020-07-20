const express = require('express')
const socketio = require('socket.io')
const http = require('http');

const {addUser,removeUser,getUser,getUserInRoom} = require('./users')

const PORT = process.env.PORT || 5000;
const router = require('./router')


const app = express();
const server = http.createServer(app); 
const io = socketio(server);

io.on('connection',(socket)=>{
    
    socket.on('join',({name,room},callback )=>{
        console.log(name,room)
        const {error,user} =addUser({id:socket.id,name,room});
        
        console.log(user)
        socket.emit('message',{user:'admin',text: `${user.name}, Welcome to the room ${user.room}` })
        socket.broadcast.to(user.room).emit('message',{user:'admin',text: `${user.name} has joined!` })


        socket.join(user.room);
        
    });


    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);
        console.log(message)
        console.log(user)
        io.to(user.room).emit('message',{user : user.name, text:message})
        callback();
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

app.use(router)
server.listen(PORT,()=> console.log(`Server has started on port ${PORT}`))
