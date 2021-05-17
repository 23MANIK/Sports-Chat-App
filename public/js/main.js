

//getting username and team from URL
const{username,teams}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
})

const socket=io();


// socket.emit('joinTeam',{username,teams});

