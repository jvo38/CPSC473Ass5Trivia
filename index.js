// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);


// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var allUsers = [];  //array to hold all users that are currently logged into trivia game in socket.io

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket)
{
	
 var addedUser = false;

  // when the client emits 'add user', this executes
  socket.on('add user', function (username) 
  {
    if (addedUser) return;
    allUsers.push(username);		//push new user into array storing all users currently online
    socket.allUsers = allUsers;		//store list of all current online users into socket session for this client

    // store the username in the socket session for this client
    socket.username = username;
    addedUser = true;
    socket.emit('login', 	//once client logs in, this executes
    {
      allUsers: socket.allUsers
    });

    // update users online when a new user joins
    socket.broadcast.emit('user joined', 
    {
      //username: socket.username,
      allUsers: socket.allUsers,
    });
  });

	//message of chat
  	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});
});

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});