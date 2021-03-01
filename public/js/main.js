const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log({ username, room });

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (msg) => {
  outputMsg(msg);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output msg to DOM
function outputMsg(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
      ${msg.text}
    </p>
  `;

  document.querySelector('.chat-messages').appendChild(div);
}

// Output room name to the DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  usersList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `;
}

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get msg text
  const msg = e.target.elements.msg.value;

  // Emit a message to the server
  socket.emit('chatMessage', msg);

  // Clear input field
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
