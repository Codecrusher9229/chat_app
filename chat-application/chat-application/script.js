// User mapping
const userNames = {
    user1: 'Juggi Lal',
    user2: 'Ram Dulare'
};

const chats = {
    user1: [
        { type: 'received', text: 'Hello, how are you?', time: '10:30 AM' },
        { type: 'sent', text: 'I\'m good, thanks! How about you?', time: '10:32 AM' }
    ],
    user2: [
        { type: 'received', text: 'Hey, what\'s up?', time: '11:00 AM' },
        { type: 'sent', text: 'Not much, just working on a project.', time: '11:05 AM' }
    ]
};

// Set up the chat list with user names
document.querySelectorAll('.chat-list-item').forEach(item => {
    const userId = item.getAttribute('data-user');
    item.querySelector('.chat-info h3').textContent = userNames[userId];
    item.addEventListener('click', () => {
        loadChat(userId);
        document.querySelector('.chat-list-item.active').classList.remove('active');
        item.classList.add('active');

        // Show chat window for mobile
        document.querySelector('.chat-window').classList.add('active');
        document.querySelector('.sidebar').style.display = 'none';
    });
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('attachBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

document.getElementById('mediaBtn').addEventListener('click', () => {
    alert('Media sharing feature coming soon!');
});

document.getElementById('voiceNoteBtn').addEventListener('click', () => {
    alert('Voice note recording feature coming soon!');
});

// Back button functionality for mobile
document.querySelector('.back-btn').addEventListener('click', () => {
    document.querySelector('.chat-window').classList.remove('active');
    document.querySelector('.sidebar').style.display = 'block';
});

function loadChat(userId) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Clear the chat window

    chats[userId].forEach(message => {
        appendMessageToChat(message, userId);
    });

    // Update the header with the selected user's info
    const chatHeaderImg = document.getElementById('chatHeaderImg');
    const chatHeaderName = document.getElementById('chatHeaderName');
    chatHeaderImg.src = `images/${userId}.jpeg`; // Assuming the image filename matches the userId
    chatHeaderName.textContent = userNames[userId]; // Use the name from userNames mapping

    // Auto-scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const inputField = document.getElementById('chatInput');
    const messageText = inputField.value.trim();
    const activeUser = document.querySelector('.chat-list-item.active').getAttribute('data-user');

    if (messageText !== '') {
        const message = {
            type: 'sent',
            text: messageText,
            time: getTime()
        };
        appendMessageToChat(message, activeUser);
        chats[activeUser].push(message);

        // Clear the input field after sending the message
        inputField.value = '';
        inputField.focus();

        // Auto-scroll to the bottom
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const activeUser = document.querySelector('.chat-list-item.active').getAttribute('data-user');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let message;

            if (file.type.startsWith('image/')) {
                message = {
                    type: 'sent',
                    content: `<img src="${e.target.result}" alt="${file.name}" />`,
                    time: getTime()
                };
            } else if (file.type.startsWith('audio/')) {
                message = {
                    type: 'sent',
                    content: `<audio controls><source src="${e.target.result}" type="${file.type}">Your browser does not support the audio element.</audio>`,
                    time: getTime()
                };
            } else {
                message = {
                    type: 'sent',
                    content: `<a href="${e.target.result}" download="${file.name}">${file.name}</a>`,
                    time: getTime()
                };
            }

            appendMessageToChat(message, activeUser);
            chats[activeUser].push(message);
        };
        reader.readAsDataURL(file);
    }
}

function appendMessageToChat(message, userId) {
    const chatMessages = document.getElementById('chatMessages');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('chat-message', message.type);

    if (message.text) {
        messageContainer.innerHTML = `
            <p>${message.text}</p>
            <span class="time">${message.time}</span>
        `;
    } else if (message.content) {
        messageContainer.innerHTML = `
            ${message.content}
            <span class="time">${message.time}</span>
        `;
    }

    chatMessages.appendChild(messageContainer);
}

function getTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

// Load the default chat (User 1)
loadChat('user1');