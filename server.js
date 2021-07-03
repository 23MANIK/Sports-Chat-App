//getting Starting with required libraries
const socketio=require('socket.io');
const http=require('http')
const express=require("express");
const path=require('path');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getTeamUsers}=require('./utils/users');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ChatApp', {useNewUrlParser: true, useUnifiedTopology: true});

const app=express();
const server=http.createServer(app);
const io=socketio(server);

//setting static path. Path module is used for handling and transforming file paths
app.use(express.static(path.join(__dirname,'public')));
 
const botName='sysMsg';

const chatMsgSchema= new mongoose.Schema({
    name:String,
    msg:String,
    team: String
}, 
{
    timestamps: true
});

const chatMsg=mongoose.model("chatMsg",chatMsgSchema);

// var chatmsg=new chatMsg({
//     name: "rajpoot",
//     msg:"king of world",
//     team:"volleyball"
// });

// chatmsg.save();


//Run when client connets
io.on('connection',socket=>{

    socket.on('joinTeam', async ({username,teams})=>{

        const msgs=await chatMsg.find({}); 
        // console.log(msgs);
        const user=userJoin(socket.id,username,teams);

        socket.join(user.team);

        for(let i = 0 ; i < msgs.length; i++) {
            if(user.team===msgs[i].team)
            socket.emit('message',formatMessage(msgs[i].name,msgs[i].msg));
         }
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

        var chatmsg=new chatMsg({
            name: user.username,
            msg: msg,
            team: user.team
        });
        chatmsg.save();
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