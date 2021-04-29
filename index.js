require('dotenv').config()
const path = require('path')
const express = require('express');
const app = express();
const http = require('http')
const socketio = require('socket.io')
const formatMessages = require('./utlis/messages')
const { userJoin, getCurrentUser, userLeaves, getRoomUser } = require('./utlis/user')
const bot = "Pritam"


const server = http.createServer(app);
const io = socketio(server);


//Set Static folder
const publicFiles =  path.join(__dirname, "./public");
app.use(express.static(publicFiles));

///Setting for outside clients

io.on('connection', socket =>{

    ////Connection to the room

    socket.on('joinRoom', ({username, room})=> {
           
        const user= userJoin(socket.id, username, room)

        ///Joining the user

        socket.join(user.room);

        //sending welcome message

       socket.emit('message', formatMessages(bot, 'Welcome to chat'));

        //Broadcast the user when some connects 
        ///broadcast.emit helps you to emit message other than you

        socket.broadcast.to(user.room).emit('message', formatMessages(bot, `${user.username} has joined the chat.`))

        ///send users and room info

        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUser(user.room)
        })
    })


   
    ///Listen for chat message
    socket.on('chatMsg', (message)=> {

        const user = getCurrentUser(socket.id)
     io.to(user.room).emit('message', formatMessages(user.username, message))
    })

    //Runs when the user disconnects

    socket.on('disconnect', ()=> {
        const user = userLeaves(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessages(bot, `${user.username} has left the chat.`));

            ///send users and room info
            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUser(user.room)
            })
        }

    })
})

const PORT = process.env.PORT;

server.listen(PORT, ()=> {
    console.log('Server is up at : '+PORT);
})