//getting Starting with required libraries
const socketio=require('socket.io');
const http=require('http')
const express=require("express");
const path=require('path');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getTeamUsers}=require('./utils/users');



const app=express();
const server=http.createServer(app);
const io=socketio(server);

//setting static path. Path module is used for handling and transforming file paths
app.use(express.static(path.join(__dirname,'public')));

const botName='sysMsg';
//Run when client connets
io.on('connection',socket=>{

    socket.on('joinTeam',({username,teams})=>{

        const user=userJoin(socket.id,username,teams);

        socket.join(user.team);

        //Welcome current user
        socket.emit('message',formatMessage(botName,"Welcome to Sports team Chat"));

        //Broadcast when a user connects
        socket.broadcast.to(user.team).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

        //Send users and room info
        io.to(user.team).emit('teamUsers',{
            team: user.team,
            users: getTeamUsers(user.team)
        });
    });

    //Listen for ChatMessage
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id);

        io.to(user.team).emit('message',formatMessage(user.username,msg));
    });

    // Run when client disconnects
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);

        if(user)
        {
            io.to(user.team).emit(
                'message',
                formatMessage(botName,`${user.username} has left the chat`)
            );
        //Send users and room info
        io.to(user.team).emit('teamUsers',{room: user.team,users: getTeamUsers(user.team)});
        }
    });


});


// Run server on env port and at local port
const PORT=process.env.PORT||3000;
server.listen(PORT,()=>{
    console.log('server is running on port '+3000);
});