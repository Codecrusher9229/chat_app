// User mapping
const userNames = {
    user1: 'Juggi Lal',
    user2: 'Ram Dulare',
    // Add more users as needed
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

let activeChat = 'user1';
const groups = {};

// Set up the chat list with user names
function setupChatList() {
    document.querySelectorAll('.chat-list-item').forEach(item => {
        const userId = item.getAttribute('data-user');
        item.querySelector('.chat-info h3').textContent = userNames[userId] || userId;
        item.addEventListener('click', () => {
            loadChat(userId);
            document.querySelector('.chat-list-item.active').classList.remove('active');
            item.classList.add('active');

            // Show chat window for mobile
            document.querySelector('.chat-window').classList.add('active');
            document.querySelector('.sidebar').style.display = 'none';
        });
    });
}

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

// Open the New Group modal
document.getElementById('newGroupBtn').addEventListener('click', () => {
    openNewGroupModal();
});

// Handle creating a new group
document.getElementById('createGroupBtn').addEventListener('click', createGroup);
document.getElementById('cancelGroupBtn').addEventListener('click', () => {
    document.getElementById('userSelectionModal').style.display = 'none';
});

// Load chat based on user or group
function loadChat(userId) {
    activeChat = userId;
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Clear the chat window

    const chat = groups[userId] || chats[userId] || []; // Handle empty chats

    chat.forEach(message => {
        appendMessageToChat(message, userId);
    });

    // Update the header with the selected user's or group's info
    const chatHeaderImg = document.getElementById('chatHeaderImg');
    const chatHeaderName = document.getElementById('chatHeaderName');

    if (groups[userId]) {
        chatHeaderImg.src = `images/${userId}_icon.png`; // Ensure this path matches the actual file path
        chatHeaderName.textContent = userId; // Use the group name
    } else {
        chatHeaderImg.src = `images/${userId}.jpeg`; // Assuming the image filename matches the userId
        chatHeaderName.textContent = userNames[userId]; // Use the name from userNames mapping
    }

    // Auto-scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a message
function sendMessage() {
    const inputField = document.getElementById('chatInput');
    const messageText = inputField.value.trim();

    if (messageText !== '') {
        const message = {
            type: 'sent',
            text: messageText,
            time: getTime()
        };
        appendMessageToChat(message, activeChat);

        if (groups[activeChat]) {
            groups[activeChat].push(message);
        } else {
            chats[activeChat].push(message);
        }

        // Clear the input field after sending the message
        inputField.value = '';
        inputField.focus();

        // Auto-scroll to the bottom
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];

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

            appendMessageToChat(message, activeChat);

            if (groups[activeChat]) {
                groups[activeChat].push(message);
            } else {
                chats[activeChat].push(message);
            }
        };
        reader.readAsDataURL(file);
    }
}

// Append message to chat window
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

// Get current time
function getTime() {
    const now = new Date();
    return formatTime(now);
}

// Format time in 12-hour format (HH:MM AM/PM)
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
}

// Open New Group modal
function openNewGroupModal() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    for (const userId in userNames) {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <input type="checkbox" id="${userId}" value="${userId}">
            <label for="${userId}">${userNames[userId]}</label>
        `;
        userList.appendChild(userItem);
    }

    document.getElementById('userSelectionModal').style.display = 'block';
}

// Create a new group
function createGroup() {
    const selectedUsers = [];
    document.querySelectorAll('#userList input[type="checkbox"]:checked').forEach(checkbox => {
        selectedUsers.push(checkbox.value);
    });

    if (selectedUsers.length > 0) {
        const groupName = prompt('Enter a name for the group:');
        const groupIconInput = document.getElementById('groupIconInput');
        let groupIconSrc = 'images/group_icon.jpeg'; // Default group icon

        if (groupIconInput.files && groupIconInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                groupIconSrc = e.target.result;
                finalizeGroupCreation(groupName, selectedUsers, groupIconSrc);
            };
            reader.readAsDataURL(groupIconInput.files[0]);
        } else {
            finalizeGroupCreation(groupName, selectedUsers, groupIconSrc);
        }
    } else {
        alert('Please select at least one user to create a group.');
    }
}

// Finalize group creation
function finalizeGroupCreation(groupName, selectedUsers, groupIconSrc) {
    if (groupName) {
        groups[groupName] = [];

        // Add selected users' chats to the new group (optional: modify as per your needs)
        selectedUsers.forEach(userId => {
            groups[groupName] = groups[groupName].concat(chats[userId]);
        });

        // Ensure a default icon is used if no custom icon is provided
        groupIconSrc = groupIconSrc || 'images/default_group_icon.jpeg';

        // Add the new group to the chat list
        const chatList = document.getElementById('chatList');
        const groupItem = document.createElement('div');
        groupItem.classList.add('chat-list-item');
        groupItem.setAttribute('data-user', groupName);
        groupItem.innerHTML = `
            <img src="${groupIconSrc}" alt="Group Icon">
            <div class="chat-info">
                <h3>${groupName}</h3>
                <p>New group created</p>
            </div>
        `;
        chatList.appendChild(groupItem);

        groupItem.addEventListener('click', () => {
            loadChat(groupName);
            document.querySelector('.chat-list-item.active').classList.remove('active');
            groupItem.classList.add('active');

            // Show chat window for mobile
            document.querySelector('.chat-window').classList.add('active');
            document.querySelector('.sidebar').style.display = 'none';
        });

        // Hide the new group modal
        document.getElementById('userSelectionModal').style.display = 'none';
    }
}

function goBack() {
    window.history.back();
}

const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceNoteBtn = document.getElementById('voiceNoteBtn');

chatInput.addEventListener('input', function() {
    if (chatInput.value.trim() !== "") {
        sendBtn.style.display = 'block';
        voiceNoteBtn.style.display = 'none';
    } else {
        sendBtn.style.display = 'none';
        voiceNoteBtn.style.display = 'block';
    }
});

// "More Options" button functionality
document.getElementById('moreOptionsBtn').addEventListener('click', () => {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
});

document.addEventListener('click', (event) => {
    if (!document.getElementById('moreOptionsBtn').contains(event.target) && !document.getElementById('dropdownMenu').contains(event.target)) {
        document.getElementById('dropdownMenu').style.display = 'none';
    }
});

// Initial setup
setupChatList();