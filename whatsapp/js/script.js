// DOM Elements
const chatList = document.querySelector('.chat-list');
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.querySelector('.message-input input');
const sendButton = document.querySelector('.send-btn');

// Sample data (replace with actual data fetching logic)
const contacts = [
    { id: 1, name: 'Alice', avatar: 'img/default-avatar.png', lastMessage: 'Hey there!' },
    { id: 2, name: 'Bob', avatar: 'img/default-avatar.png', lastMessage: 'How are you?' },
    // Add more contacts as needed
];

// Render chat list
function renderChatList() {
    chatList.innerHTML = contacts.map(contact => `
        <div class="chat-item" data-id="${contact.id}">
            <img src="${contact.avatar}" alt="${contact.name}" class="avatar">
            <div class="chat-info">
                <span class="contact-name">${contact.name}</span>
                <span class="last-message">${contact.lastMessage}</span>
            </div>
        </div>
    `).join('');
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize
renderChatList();

// Fetch and parse emoji data
fetch('assets/emoji-data.json')
    .then(response => response.json())
    .then(data => {
        // Store emoji data for later use
        window.emojiData = data;
    })
    .catch(error => console.error('Error loading emoji data:', error));
