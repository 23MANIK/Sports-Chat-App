//getting Starting with required libraries
const socketio=require('socket.io');
const http=require('http')
const express=require("express");
const path=require('path');



const app=express();
const server=http.createServer(app);
const io=socketio(server);

//setting static path. Path module is used for handling and transforming file paths
app.use(express.static(path.join(__dirname,'public')));

//Run when client connets
io.on('connection',socket=>{

    socket.on('joinTeam',({username,team})=>{
        console.log(username+"  hello");
    });

    socket.emit('message',"welcome to chat bot !");

    socket.on('chatMessage',msg=>{
            
        io.emit('message',msg);
    })


    socket.on('disconnect',()=>{
        io.emit('message',"a user have left the chat");
    })

       


});

// Run server on env port and at local port
const PORT=process.env.PORT||3000;
server.listen(PORT,()=>{
    console.log('server is running on port '+3000);
});