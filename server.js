const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const formatMsg = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Xtensio Bot';

// Run when client connects
io.on('connection', (socket) => {
  // Welcome current user
  socket.emit('message', formatMsg(botName, 'Welcome to Xtensio chat'));

  // Broadcast when a user connects
  socket.broadcast.emit(
    'message',
    formatMsg(botName, 'A user has joined the chat')
  );

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMsg(botName, 'A user has left the chat'));
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMsg('User', msg));
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
