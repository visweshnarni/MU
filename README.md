# SugarTalk Application

A WhatsApp-like chat application that allows users to communicate individually over a local network. Only authenticated users with credentials stored in a JSON file can access the chat.

## Features

- User authentication from a JSON file
- WhatsApp-like interface with sidebar user list
- Individual one-to-one chats (not group chats)
- Real-time messaging using Socket.IO
- Network-wide access for all devices on the same network
- Online/offline status indicators
- **Dark Mode / Light Mode** theme options
- Modern and responsive UI
- Message history persistence
- **Gemini AI-powered conversation monitoring** - Detects heated arguments and suggests de-escalation tactics

## Prerequisites

- Python 3.7+
- Flask and required libraries
- Google Generative AI (Gemini) API key

## Installation

1. Clone this repository or download the source code.

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

1. User accounts are stored in `users.json`. The default file contains sample accounts:
   ```json
   [
     {
       "username": "user1",
       "password": "password1"
     },
     {
       "username": "user2",
       "password": "password2"
     },
     {
       "username": "admin",
       "password": "admin123"
     }
   ]
   ```

2. You can modify this file to add/remove users as needed.

3. The Gemini API key is already included in the app.py file. If needed, you can replace it with your own key.

## Running the Application

1. Start the Flask server:
   ```
   python app.py
   ```

2. The server will display the local IP address and port (default: 5000).

3. Access the chat application from any device on the same network:
   - On the host machine: `http://localhost:5000`
   - On other devices: `http://<host-ip-address>:5000`

## Usage

1. Login with a username and password from the `users.json` file.
2. The sidebar will display all available users on the network.
3. Click on a user to start a private chat with them.
4. Green dot indicates users who are online.
5. New unread messages are indicated with a green dot next to the user's name.
6. Messages are stored in memory during the server's runtime.

### Dark/Light Mode Theme

1. Click the moon/sun icon next to "ME" in the sidebar header to toggle between dark and light mode.
2. Your theme preference will be saved for future sessions.

### Gemini AI Chat Monitor

1. Click the robot icon (🤖) next to the send button to enable/disable the Gemini AI chat monitor.
2. When enabled, Gemini will analyze conversations for heated arguments or toxic content.
3. If detected, a suggestion box will appear with de-escalation suggestions.
4. Click the X on the suggestion box to dismiss it.

## Security Considerations

- This is a basic implementation. In a production environment, you should:
  - Use HTTPS
  - Hash passwords instead of storing them in plain text
  - Implement proper session management
  - Consider database storage for messages and user data
  - Secure your API keys

## License

This project is open source and available under the MIT License. 