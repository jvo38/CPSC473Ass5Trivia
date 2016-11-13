$(function(){

	var $usernameInput = $('.usernameInput');
	var $messages = $('#messages');
	var $inputMessage = $('#m');

	var $loginPage = $('.login.page');
	var $chatPage = $('.chat.page');
	var $usersOnline = $('#usersOnline');

// intializing variables 
	var username;
	var $currentInput = $usernameInput.focus();

	var socket = io();

	function displayOnlineUsers (data) 
	{
		var usersOnlineDisplay = '';
		usersOnlineDisplay += "Current Online Users: " + data.allUsers;
		$('#usersOnline').html(usersOnlineDisplay)
		// PRINT usersOnlineDisplay VARIABLE TO HTML PAGE HERE **********************
	}

// when clicking on the form emit 'chat message'
 	$('form').submit(function(){
     	socket.emit('chat message', $('#m').val());
     	$('#m').val('');
     	return false;
   	});

 	socket.on('chat message', function(msg){
 		$('#messages').append($('<li>').text(msg));
    });

// setting username
	function setUsername() {
		username = $usernameInput.val().trim();

		if (username){
			$loginPage.fadeOut();
			$chatPage.show();
			$loginPage.off('click');
			$currentInput = $inputMessage.focus();


			socket.emit('add user', username);
		}
	}

// click events

	// $loginPage.click(function () {
	// 	$currentInput.focus();
	// });

	// $inputMessage.click(function (){
	// 	$inputMessage.focus();
	// });

// keyboard events
	$('.usernameInput').on('keypress', function (event){
		if(event.keyCode === 13){
			setUsername();
		}	
	});

//============================== Sockets ==========================================

	// Whenever the server emits 'login', display the current users online
	socket.on('login', function (data) 
	{
		//connected = true;
		displayOnlineUsers(data);
	});

	// update the display of users online whenever someone new joins the game
	socket.on('user joined', function (data) 
	{
		displayOnlineUsers(data);
	});

});


