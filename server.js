let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let numUsers = 0;
let currentSocket;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
    currentSocket = socket;
//   console.log('a user connected');
  socket.on('disconnect', function(){
    // console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('add user', (username) => {
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    let nameData = fs.readFileSync('name.txt','utf-8');
    nameData = nameData+username+",";
    fs.writeFileSync('name.txt',nameData);
    socket.emit('login', {
      numUsers: numUsers,
      currentName:username
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
});


module.exports = server;