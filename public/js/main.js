//geting element variable from chat.html
const chatForm = document.getElementById("chat_form");
const chatMessages = document.querySelector(".chat_messages");
const teamName = document.getElementById("your_team");
const userList = document.getElementById("users");

//getting username and team from URL
const { username, teams } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//join chatroom
socket.emit("joinTeam", { username, teams });

//Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //Scroll down to make scrollable chat box
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", (evt) => {
  evt.preventDefault(); //preventing to creating a file which is default setting
  let msg = evt.target.elements.msg.value;
  msg=msg.trim();

  if(!msg){
    return false;
  }
  //emit message to server
  socket.emit("chatMessage", msg);

  //Clear input
  evt.target.elements.msg.value = "";
  evt.target.elements.msg.focus();
});

//FUNTIONS

function outputMessage(message) { 
  
  const div=document.createElement('div');
  div.classList.add("message");
  // const p=document.createElement("p")
  // p.classList.add("meta");
  // p.innerText=message.username;
  // div.appendChild(p);
  const para=document.createElement('p');
  para.classList.add('text');
  para.innerText=message;
  div.appendChild(para);
  document.querySelector('.chat_messages').appendChild(div);


};
