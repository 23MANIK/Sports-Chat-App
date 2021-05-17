const chatForm=document.getElementById('chat-form');//msg form
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList =document.getElementById('users');

//Get username and room from URL
const {username,teams}=Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

const socket=io();

//Join Chatroom
socket.emit('joinRoom',{username,teams});

socket.on('roomUsers',({teams,users})=>{
  outputRoomName(teams);
  outputUsers(users);
});

//Message from server
socket.on('message',msg=>{
  console.log(msg);
  outputMessage(msg);//for sending on html page

  //Scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight;
  
});


//message submit
chatForm.addEventListener('submit',response=>{
  response.preventDefault();//avoiding creating of file which is a default behaviour;
  //Get message text
  const msg=response.target.elements.msg.value;
  //Emit message to server
  socket.emit('chatMessage',msg);

  //Clear input
  response.target.msg.value='';
  response.target.msg.focus();

});

 //Output message to DOM
 function outputMessage(message){
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
   <p class="text">
   ${message.text}
   </p>`;  
   document.querySelector('.chat-messages').appendChild(div);
 }

 //add room name to DOM
 function outputRoomName(room)
 {
   roomName.innerText=room;
 };

 //Add users to DOM
 function outputUsers(users){
   userList.innerHTML=`
   ${users.map(user=>`<li>${user.username}</li>`).join('')}
   `;
 };