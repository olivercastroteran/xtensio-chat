const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
    <p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
      ${msg}
    </p>
  `;

  document.querySelector('.chat-messages').appendChild(div);
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
