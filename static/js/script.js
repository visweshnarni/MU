document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginContainer = document.getElementById('login-container');
    const chatContainer = document.getElementById('chat-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');
    const usersList = document.getElementById('users-list');
    const currentChatUser = document.getElementById('current-chat-user');
    const searchUsersInput = document.getElementById('search-users');
    const geminiToggle = document.getElementById('gemini-toggle');
    const suggestionBox = document.getElementById('suggestion-box');
    const suggestionContent = document.getElementById('suggestion-content');
    const dismissSuggestion = document.getElementById('dismiss-suggestion');
    const themeToggle = document.getElementById('theme-toggle');
    // SugarTalk elements
    const sugartalkBtn = document.getElementById('sugartalk-btn');
    const sugartalkModal = document.getElementById('sugartalk-modal');
    const closeModal = document.querySelector('.modal .close');
    const originalMessage = document.getElementById('original-message');
    const transformedMessage = document.getElementById('transformed-message');
    const transformBtn = document.getElementById('transform-btn');
    const sendTransformedBtn = document.getElementById('send-transformed-btn');
    const cancelTransformBtn = document.getElementById('cancel-transform-btn');
    const toneOptions = document.querySelectorAll('.tone-option');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const transformedContainer = document.querySelector('.transformed-message-container');
    const toneSelectionActions = document.querySelector('.tone-selection-actions');
    const transformedActions = document.querySelector('.transformed-actions');
    const tryDifferentToneBtn = document.getElementById('try-different-tone-btn');
    const sendOriginalBtn = document.getElementById('send-original-btn');
    const healthSuggestionContainer = document.getElementById('health-suggestion-container');
    const healthSuggestion = document.getElementById('health-suggestion');
    // Emoji picker elements
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const closeEmojiPickerBtn = document.getElementById('close-emoji-picker');
    const emojiContainer = document.getElementById('emoji-container');
    const emojiCategoryButtons = document.querySelectorAll('.emoji-categories button');
    const emojiSearch = document.getElementById('emoji-search');

    // Variables
    let socket = null;
    let sessionId = null;
    let username = null;
    let selectedUser = null;
    let users = [];
    let geminiEnabled = false;
    let isDarkTheme = false;
    let messageAnalysisTimeout = null;
    let selectedTone = null;
    let currentTransformedMessage = '';
    let currentEmojiCategory = 'smileys';
    const messageCache = {}; // Cache for messages by chat
    
    // Emoji data by category
    const emojiData = {
        smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '😝', '🤑', '🤗', '🤔', '🤭', '🤫', '🤥', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟'],
        people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '👩'],
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑'],
        food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙'],
        travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸'],
        activities: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴'],
        objects: ['⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴'],
        symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳'],
        flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬']
    };

    // Check if user is already logged in (session stored in localStorage)
    const storedSessionId = localStorage.getItem('sessionId');
    const storedUsername = localStorage.getItem('username');
    
    // Check theme preference
    initializeTheme();
    
    if (storedSessionId && storedUsername) {
        sessionId = storedSessionId;
        username = storedUsername;
        connectToChat();
    }

    // Event Listeners
    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    searchUsersInput.addEventListener('input', filterUsers);
    
    geminiToggle.addEventListener('click', () => {
        geminiEnabled = !geminiEnabled;
        geminiToggle.classList.toggle('active', geminiEnabled);
        localStorage.setItem('geminiEnabled', geminiEnabled);
    });
    
    themeToggle.addEventListener('click', toggleTheme);
    
    dismissSuggestion.addEventListener('click', () => {
        suggestionBox.style.display = 'none';
    });
    
    // SugarTalk event listeners
    sugartalkBtn.addEventListener('click', openSugartalkModal);
    closeModal.addEventListener('click', closeSugartalkModal);
    cancelTransformBtn.addEventListener('click', closeSugartalkModal);
    
    toneOptions.forEach(option => {
        option.addEventListener('click', () => selectTone(option));
    });
    
    transformBtn.addEventListener('click', transformMessage);
    sendTransformedBtn.addEventListener('click', sendTransformedMessage);
    tryDifferentToneBtn.addEventListener('click', resetToToneSelection);
    sendOriginalBtn.addEventListener('click', sendOriginalMessage);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === sugartalkModal) {
            closeSugartalkModal();
        }
    });
    
    // Emoji picker event listeners
    emojiBtn.addEventListener('click', toggleEmojiPicker);
    closeEmojiPickerBtn.addEventListener('click', closeEmojiPicker);
    emojiSearch.addEventListener('input', searchEmojis);
    
    // Handle category selection
    emojiCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            setEmojiCategory(category);
        });
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (emojiPicker.style.display === 'block' && 
            !emojiPicker.contains(e.target) && 
            e.target !== emojiBtn) {
            closeEmojiPicker();
        }
    });
    
    // Initialize the emoji picker with the default category
    initEmojiPicker();
    
    // Initialize theme based on localStorage or system preference
    function initializeTheme() {
        const savedTheme = localStorage.getItem('darkTheme');
        
        if (savedTheme === 'true') {
            enableDarkTheme();
        } else if (savedTheme === 'false') {
            enableLightTheme();
        } else {
            // Use system preference as default if no saved preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                enableDarkTheme();
            } else {
                enableLightTheme();
            }
        }
    }
    
    // Toggle between dark and light theme
    function toggleTheme() {
        if (isDarkTheme) {
            enableLightTheme();
        } else {
            enableDarkTheme();
        }
        localStorage.setItem('darkTheme', isDarkTheme);
    }
    
    // Enable dark theme
    function enableDarkTheme() {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        isDarkTheme = true;
    }
    
    // Enable light theme
    function enableLightTheme() {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        isDarkTheme = false;
    }

    // Login function
    async function login() {
        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        
        if (!usernameValue || !passwordValue) {
            showLoginError('Please enter both username and password');
            return;
        }
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                sessionId = data.session_id;
                username = data.username;
                
                // Store session in localStorage
                localStorage.setItem('sessionId', sessionId);
                localStorage.setItem('username', username);
                
                // Check for saved gemini preference
                geminiEnabled = localStorage.getItem('geminiEnabled') === 'true';
                if (geminiEnabled) {
                    geminiToggle.classList.add('active');
                }
                
                // Connect to chat
                connectToChat();
            } else {
                showLoginError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            showLoginError('Error connecting to server');
            console.error('Login error:', error);
        }
    }

    // Logout function
    async function logout() {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId
                })
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        // Disconnect socket
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        
        // Clear session
        sessionId = null;
        username = null;
        selectedUser = null;
        localStorage.removeItem('sessionId');
        localStorage.removeItem('username');
        
        // Show login screen
        loginContainer.style.display = 'block';
        chatContainer.style.display = 'none';
        chatBox.innerHTML = '';
        usernameInput.value = '';
        passwordInput.value = '';
    }

    // Connect to chat using Socket.IO
    function connectToChat() {
        // Hide login, show chat
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        loginError.textContent = '';
        
        // Load users
        loadUsers();
        
        // Connect to Socket.IO
        socket = io('', {
            query: {
                session_id: sessionId
            }
        });
        
        // Socket event handlers
        socket.on('connect', () => {
            console.log('Connected to chat server');
        });
        
        socket.on('disconnect', () => {
            console.log('Disconnected from chat server');
        });
        
        socket.on('private_message', (message) => {
            const chatParticipant = message.sender === username ? message.recipient : message.sender;
            
            // Add message to cache
            if (!messageCache[chatParticipant]) {
                messageCache[chatParticipant] = [];
            }
            messageCache[chatParticipant].push(message);
            
            // If this is the currently selected chat, display the message
            if (selectedUser === chatParticipant) {
                appendMessage(message);
                chatBox.scrollTop = chatBox.scrollHeight;
                
                // Analyze conversation if Gemini is enabled and the message is from the other user
                if (geminiEnabled && message.sender !== username) {
                    // Clear previous timeout to avoid multiple analyses
                    if (messageAnalysisTimeout) {
                        clearTimeout(messageAnalysisTimeout);
                    }
                    
                    // Add a small delay to allow for more context before analysis
                    messageAnalysisTimeout = setTimeout(() => {
                        analyzeConversation(messageCache[chatParticipant]);
                    }, 1000);
                }
            }
            
            // Update user in the list to show new message
            updateUserWithNewMessage(chatParticipant);
        });
        
        socket.on('user_status', (data) => {
            updateUserStatus(data.username, data.online);
        });
    }
    
    // Open SugarTalk modal
    function openSugartalkModal() {
        const messageText = messageInput.value.trim();
        
        // Don't open if no message
        if (!messageText) {
            return;
        }
        
        // Reset modal state
        originalMessage.textContent = messageText;
        transformedMessage.textContent = '';
        transformedContainer.style.display = 'none';
        loadingSpinner.style.display = 'none';
        healthSuggestionContainer.style.display = 'none';
        
        // Show tone selection actions, hide transformed actions
        toneSelectionActions.style.display = 'flex';
        transformedActions.style.display = 'none';
        
        // Disable transform button until tone is selected
        transformBtn.disabled = true;
        
        // Clear tone selection
        toneOptions.forEach(option => option.classList.remove('selected'));
        selectedTone = null;
        
        // Show modal
        sugartalkModal.style.display = 'block';
    }
    
    // Close SugarTalk modal
    function closeSugartalkModal() {
        sugartalkModal.style.display = 'none';
        currentTransformedMessage = '';
    }
    
    // Select a tone
    function selectTone(optionElement) {
        // Clear previous selection
        toneOptions.forEach(option => option.classList.remove('selected'));
        
        // Set new selection
        optionElement.classList.add('selected');
        selectedTone = optionElement.getAttribute('data-tone');
        
        // Enable transform button
        transformBtn.disabled = false;
        
        // Clear previous transformation
        transformedMessage.textContent = '';
        transformedContainer.style.display = 'none';
        toneSelectionActions.style.display = 'flex';
        transformedActions.style.display = 'none';
    }
    
    // Reset to tone selection view
    function resetToToneSelection() {
        // Clear transformation
        transformedMessage.textContent = '';
        transformedContainer.style.display = 'none';
        
        // Show tone selection actions, hide transformed actions
        toneSelectionActions.style.display = 'flex';
        transformedActions.style.display = 'none';
        
        // Clear health suggestion
        healthSuggestionContainer.style.display = 'none';
    }
    
    // Transform message using selected tone
    async function transformMessage() {
        if (!selectedTone || !originalMessage.textContent.trim()) {
            return;
        }
        
        // Show loading spinner
        loadingSpinner.style.display = 'flex';
        transformBtn.disabled = true;
        
        try {
            const response = await fetch('/api/sugartalk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: originalMessage.textContent.trim(),
                    tone: selectedTone
                })
            });
            
            const data = await response.json();
            
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            if (data.success) {
                // Show transformed message
                transformedMessage.textContent = data.transformed_message;
                transformedContainer.style.display = 'block';
                
                // Store for later use
                currentTransformedMessage = data.transformed_message;
                
                // Show appropriate actions
                toneSelectionActions.style.display = 'none';
                transformedActions.style.display = 'flex';
                
                // Show health suggestion if message is heated
                if (data.is_heated && data.health_suggestion) {
                    healthSuggestion.textContent = data.health_suggestion;
                    healthSuggestionContainer.style.display = 'flex';
                } else {
                    healthSuggestionContainer.style.display = 'none';
                }
            } else {
                transformedMessage.textContent = 'Error: ' + (data.message || 'Failed to transform message');
                transformedContainer.style.display = 'block';
                toneSelectionActions.style.display = 'flex';
                transformedActions.style.display = 'none';
            }
        } catch (error) {
            console.error('Error transforming message:', error);
            loadingSpinner.style.display = 'none';
            transformedMessage.textContent = 'Error: Could not connect to the server';
            transformedContainer.style.display = 'block';
            toneSelectionActions.style.display = 'flex';
            transformedActions.style.display = 'none';
        }
    }
    
    // Send the transformed message
    function sendTransformedMessage() {
        if (!currentTransformedMessage || !selectedUser) {
            console.error("Cannot send transformed message: ", 
                          !currentTransformedMessage ? "No transformed message" : "No selected user");
            return;
        }
        
        console.log("Sending transformed message:", currentTransformedMessage, "to user:", selectedUser);
        
        try {
            // Create message object
            const timestamp = new Date().toISOString();
            const message = {
                sender: username,
                recipient: selectedUser,
                message: currentTransformedMessage,
                timestamp: timestamp
            };
            
            // Send via Socket.IO
            socket.emit('private_message', {
                recipient: selectedUser,
                message: currentTransformedMessage,
                timestamp: timestamp
            });
            
            // Add to UI (will be added again when socket.io sends it back, so we don't need this)
            // Just log that we're sending
            console.log("Message sent successfully:", message);
            
            // Close modal
            closeSugartalkModal();
            
            // Clear input
            messageInput.value = '';
        } catch (error) {
            console.error("Error sending transformed message:", error);
        }
    }
    
    // Send the original message
    function sendOriginalMessage() {
        if (!originalMessage.textContent.trim() || !selectedUser) {
            console.error("Cannot send original message: ", 
                          !originalMessage.textContent.trim() ? "No original message" : "No selected user");
            return;
        }
        
        // Get the original message text
        const originalMessageText = originalMessage.textContent.trim();
        console.log("Sending original message:", originalMessageText, "to user:", selectedUser);
        
        try {
            // Create message object
            const timestamp = new Date().toISOString();
            
            // Send via Socket.IO
            socket.emit('private_message', {
                recipient: selectedUser,
                message: originalMessageText,
                timestamp: timestamp
            });
            
            // Add to UI (will be added again when socket.io sends it back, so we don't need this)
            // Just log that we're sending
            console.log("Original message sent successfully.");
            
            // Close modal
            closeSugartalkModal();
            
            // Clear input
            messageInput.value = '';
        } catch (error) {
            console.error("Error sending original message:", error);
        }
    }
    
    // Update user in list to indicate new message
    function updateUserWithNewMessage(userToUpdate) {
        const userItem = document.querySelector(`.user-item[data-username="${userToUpdate}"]`);
        
        if (userItem) {
            // Add a class to indicate new message
            if (selectedUser !== userToUpdate) {
                userItem.classList.add('new-message');
            }
            
            // Move to top of list
            const parent = userItem.parentNode;
            parent.prepend(userItem);
        }
    }

    async function analyzeConversation(messages) {
        try {
            const response = await fetch('/api/analyze-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    messages: messages
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.is_heated) {
                showSuggestion(data.suggestion);
            }
        } catch (error) {
            console.error('Error analyzing conversation:', error);
        }
    }
    
    function showSuggestion(suggestion) {
        suggestionContent.innerHTML = suggestion;
        suggestionBox.style.display = 'flex';
    }

    async function loadUsers() {
        try {
            const response = await fetch(`/api/users?session_id=${sessionId}`);
            const data = await response.json();
            
            if (data.success) {
                users = data.users;
                renderUsersList();
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    function renderUsersList() {
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.setAttribute('data-username', user.username);
            
            if (user.username === selectedUser) {
                userItem.classList.add('selected');
            }
            
            if (user.online) {
                userItem.classList.add('online');
            }
            
            userItem.innerHTML = `
                <div class="user-status">
                    <div class="status-dot"></div>
                </div>
                <div class="user-info">
                    <div class="user-name">${user.username}</div>
                </div>
            `;
            
            userItem.addEventListener('click', () => {
                selectUser(user.username);
                userItem.classList.remove('new-message');
            });
            
            usersList.appendChild(userItem);
        });
    }

    function filterUsers() {
        const searchTerm = searchUsersInput.value.toLowerCase();
        const userItems = document.querySelectorAll('.user-item');
        
        userItems.forEach(item => {
            const username = item.getAttribute('data-username').toLowerCase();
            
            if (username.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function updateUserStatus(username, isOnline) {
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].online = isOnline;
        
        const userItem = document.querySelector(`.user-item[data-username="${username}"]`);
            
            if (userItem) {
            if (isOnline) {
                    userItem.classList.add('online');
            } else {
                    userItem.classList.remove('online');
                }
            }
        } else {
            // If the user is not in our list, fetch all users again
            loadUsers();
        }
    }

    function selectUser(userToSelect) {
        // Update selected user
        selectedUser = userToSelect;
        
        // Update UI
        document.querySelectorAll('.user-item').forEach(item => {
            if (item.getAttribute('data-username') === userToSelect) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Update current chat user header
        currentChatUser.innerHTML = `
            <div class="user-avatar">
                <div class="avatar-placeholder">${userToSelect.charAt(0)}</div>
            </div>
            <div class="user-info">
                <span>${userToSelect}</span>
                <span class="user-status-text">${getUserStatusText(userToSelect)}</span>
            </div>
        `;
        
        // Clear chat box
        chatBox.innerHTML = '';
        
        // Enable message input and buttons
        messageInput.disabled = false;
        sendBtn.disabled = false;
        geminiToggle.disabled = false;
        sugartalkBtn.disabled = false;
        emojiBtn.disabled = false;
        
        // Load messages
        loadMessages(userToSelect);
        
        // Hide suggestion box
        suggestionBox.style.display = 'none';
    }
        
    function getUserStatusText(username) {
        const user = users.find(u => u.username === username);
        return user && user.online ? 'online' : 'offline';
    }

    async function loadMessages(otherUser) {
        try {
            const response = await fetch(`/api/messages?session_id=${sessionId}&other_user=${otherUser}`);
            const data = await response.json();
            
            if (data.success) {
                // Cache messages
                messageCache[otherUser] = data.messages;
                
                // Display messages
                displayMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            chatBox.innerHTML = '<div class="error-message">Error loading messages</div>';
        }
    }

    function displayMessages(messages) {
        chatBox.innerHTML = '';
        
        if (messages.length === 0) {
            chatBox.innerHTML = '<div class="no-messages">No messages yet. Say hello!</div>';
            return;
        }
        
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        messages.forEach(message => {
            const isOwnMessage = message.sender === username;
            const messageElement = document.createElement('div');
            messageElement.className = `message ${isOwnMessage ? 'own-message' : 'other-message'}`;
            
            // Create message content
            let messageContent = `<div class="message-content">`;
            
            // Add sender name for messages from others
            if (!isOwnMessage) {
                messageContent += `<div class="message-sender">${message.sender}</div>`;
            }
            
            // Add message text and timestamp
            messageContent += `
                <div class="message-text">${message.message}</div>
                <div class="message-time">${formatTimestamp(message.timestamp)}</div>
            </div>`;
            
            messageElement.innerHTML = messageContent;
            fragment.appendChild(messageElement);
        });
        
        // Append all messages at once
        chatBox.appendChild(fragment);
        
        // Scroll to bottom after all messages are loaded
        setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
        }, 0);
    }

    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText || !selectedUser) {
            return;
        }
        
        const timestamp = new Date().toISOString();
        
        // Send via Socket.IO
        socket.emit('private_message', {
            recipient: selectedUser,
            message: messageText,
            timestamp: timestamp
        });
        
        // Clear input
        messageInput.value = '';
    }

    function appendMessage(message) {
        // Remove "No messages yet" message if it exists
        const noMessagesElement = chatBox.querySelector('.no-messages');
        if (noMessagesElement) {
            chatBox.removeChild(noMessagesElement);
        }
        
        const isOwnMessage = message.sender === username;
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isOwnMessage ? 'own-message' : 'other-message'}`;
        
        // Create message content
        let messageContent = `<div class="message-content">`;
        
        // Add sender name for messages from others
        if (!isOwnMessage) {
            messageContent += `<div class="message-sender">${message.sender}</div>`;
        }
        
        // Add message text and timestamp
        messageContent += `
            <div class="message-text">${message.message}</div>
            <div class="message-time">${formatTimestamp(message.timestamp)}</div>
        </div>`;
        
        messageElement.innerHTML = messageContent;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showLoginError(message) {
        loginError.textContent = message;
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Initialize emoji picker
    function initEmojiPicker() {
        setEmojiCategory('smileys');
    }
    
    // Toggle emoji picker visibility
    function toggleEmojiPicker() {
        if (emojiPicker.style.display === 'block') {
            closeEmojiPicker();
        } else {
            openEmojiPicker();
        }
    }
    
    // Open emoji picker
    function openEmojiPicker() {
        emojiPicker.style.display = 'block';
        emojiBtn.classList.add('active');
    }
    
    // Close emoji picker
    function closeEmojiPicker() {
        emojiPicker.style.display = 'none';
        emojiBtn.classList.remove('active');
    }
    
    // Set emoji category and display emojis
    function setEmojiCategory(category) {
        currentEmojiCategory = category;
        
        // Update category button active state
        emojiCategoryButtons.forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Display emojis for the selected category
        displayEmojis(emojiData[category]);
    }
    
    // Display emojis in the container
    function displayEmojis(emojis) {
        emojiContainer.innerHTML = '';
        
        emojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            
            emojiContainer.appendChild(emojiElement);
        });
    }
    
    // Insert emoji into message input
    function insertEmoji(emoji) {
        const startPos = messageInput.selectionStart;
        const endPos = messageInput.selectionEnd;
        const textBefore = messageInput.value.substring(0, startPos);
        const textAfter = messageInput.value.substring(endPos);
        
        messageInput.value = textBefore + emoji + textAfter;
        
        // Set cursor position after the inserted emoji
        messageInput.selectionStart = startPos + emoji.length;
        messageInput.selectionEnd = startPos + emoji.length;
        
        // Focus the input after inserting
        messageInput.focus();
    }
    
    // Search emojis across all categories
    function searchEmojis() {
        const searchTerm = emojiSearch.value.toLowerCase();
        
        if (searchTerm === '') {
            // If search is cleared, return to current category
            setEmojiCategory(currentEmojiCategory);
            return;
        }
        
        // Search across all categories
        const results = [];
        for (const category in emojiData) {
            const categoryEmojis = emojiData[category];
            for (const emoji of categoryEmojis) {
                // For simplicity, we're just checking if the emoji contains the search term
                // In a real app, you might have descriptions for emojis to search through
                if (emoji.includes(searchTerm)) {
                    results.push(emoji);
                }
            }
        }
        
        displayEmojis(results);
    }
}); 