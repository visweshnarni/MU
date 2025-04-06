# SugarTalk - Sweeten Your Words, Sweeten Your World

## What's the Use of the 'Sugar' Theme?

In a world where online conversations can quickly turn sour, SugarTalk adds a delightful touch of sweetness to every message. Inspired by the hackathon theme 'SUGAR', this application turns emotionally intense or harsh messages into thoughtful, calm, and kind conversations — all with the power of AI and some sugar-coated magic. Think of it as your digital relationship therapist, serving up empathy in every reply. 💌

## Problem Statement

Online conversations often become emotionally heated or misinterpreted due to lack of tone or empathy. Many people hesitate to send messages fearing they might come off too strong, aggressive, or offensive. There's a need for a tool that can detect emotional intensity in messages and help users convey their intent without hurting sentiments.

## 💡 Our Solution — SugarTalk

Introducing SugarTalk, an AI-powered messaging assistant that acts as a peacekeeper in your DMs:

- Detects emotionally intense or harsh messages in real time
- Suggests softer, sweeter alternatives with sugar-themed tone styles
- Empowers users to send, edit, or rephrase the message based on AI suggestions
- Provides full emotional control over tone, vibe, and messaging style

With SugarTalk, you're not just chatting — you're building healthier digital relationships. 🍯

## Key Features

### 7 Sugar-Inspired Tone Styles
Users can input a message, select a tone, and get a sugarified version. Each tone has a unique emotional flavor:
### 🛠 Custom Emotional Rewriting
SugarTalk doesn't just suggest sugar-coated rewrites — it empowers the user. Once the AI gives a softened version, users can fine-tune it to match their preferred vibe.

### Example in Action

Input:  
"Shut your mouth, you never listen!"

Tone Selected: 🍓 Berry Nice  
Output:  
"Heeey, let's keep it chill please, Maybe we could take turns talking?"

Tone Selected: 💎 Bittersweet Truth  
Output:  
"I feel like I'm not being heard. Can we try having a more balanced conversation?"


## Installation

1. Clone this repository or download the source code.

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

1. User accounts are stored in `users.json`. The default file contains sample accounts:
 
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

### Dark/Light Mode Theme

1. Click the moon/sun icon next to "ME" in the sidebar header to toggle between dark and light mode.
2. Your theme preference will be saved for future sessions.

### Gemini AI Chat Monitor

1. Click the robot icon (🤖) next to the send button to enable/disable the Gemini AI chat monitor.
2. When enabled, Gemini will analyze conversations for heated arguments or toxic content.
3. If detected, a suggestion box will appear with de-escalation suggestions.
4. Click the X on the suggestion box to dismiss it.

#Images of our project
![WhatsApp Image 2025-04-06 at 10 13 40_68852e1a](https://github.com/user-attachments/assets/21a2103f-a189-43ac-8509-41e5a41f6e5e)
![WhatsApp Image 2025-04-06 at 10 21 28_c916ca4c](https://github.com/user-attachments/assets/6d039d67-6250-4002-9405-eb33580b3574)
![WhatsApp Image 2025-04-06 at 10 25 02_c20b7879](https://github.com/user-attachments/assets/efda69ce-9dad-4dff-ac85-567864234417)

## License

This project is open source and available under the MIT License. 
