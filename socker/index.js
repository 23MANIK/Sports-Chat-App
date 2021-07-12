
const socketio=require('socket.io');
const mongoose = require('mongoose');
const formatMessage=require('../utils/messages');
const {userJoin,getCurrentUser,userLeave,getTeamUsers}=require('../utils/users');

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

const socker= (server) => {
    // const io = new Server(app);
    const io=socketio(server);
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
    
        return io;
    });
    
};

module.exports=socker; 

