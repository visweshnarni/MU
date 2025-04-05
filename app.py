import os
import json
from flask import Flask, request, jsonify, render_template, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
app.config['SECRET_KEY'] = '986c4b9f38dc9f15bcc4e908e51e06c7'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure Gemini API
GEMINI_API_KEY = 'AIzaSyChtS7DJhxDwqzcZTfvDNB3vP_TgIeAKmA'
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# Load users from JSON file
def load_users():
    with open('users.json', 'r') as f:
        return json.load(f)

# Store active users and their sessions
active_users = {}
# Store chat messages between users
private_messages = {}
# Store online users
online_users = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    users = load_users()
    
    for user in users:
        if user['username'] == username and user['password'] == password:
            # Generate a simple session ID (in a real app, use something more secure)
            session_id = username + '_' + os.urandom(8).hex()
            active_users[session_id] = username
            online_users[username] = {'online': True}
            return jsonify({'success': True, 'session_id': session_id, 'username': username})
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    data = request.json
    session_id = data.get('session_id')
    
    if session_id in active_users:
        username = active_users[session_id]
        del active_users[session_id]
        if username in online_users:
            del online_users[username]
        return jsonify({'success': True})
    
    return jsonify({'success': False, 'message': 'Invalid session'}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    session_id = request.args.get('session_id')
    
    if session_id not in active_users:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    current_username = active_users[session_id]
    users = []
    
    # Get all users from JSON file
    all_users = load_users()
    
    for user in all_users:
        if user['username'] != current_username:
            users.append({
                'username': user['username'],
                'online': user['username'] in online_users
            })
    
    return jsonify({'success': True, 'users': users})

@app.route('/api/messages', methods=['GET'])
def get_messages():
    session_id = request.args.get('session_id')
    other_user = request.args.get('other_user')
    
    if session_id not in active_users:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    current_user = active_users[session_id]
    
    # Create a unique chat ID for these two users
    chat_id = get_chat_id(current_user, other_user)
    
    # Return messages for this chat
    messages = private_messages.get(chat_id, [])
    
    return jsonify({'success': True, 'messages': messages})

@app.route('/api/analyze-conversation', methods=['POST'])
def analyze_conversation():
    session_id = request.json.get('session_id')
    messages = request.json.get('messages', [])
    
    if session_id not in active_users:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    if not messages:
        return jsonify({'success': False, 'message': 'No messages to analyze'}), 400
    
    try:
        # Format conversation for Gemini
        formatted_messages = []
        for msg in messages[-10:]:  # Use last 10 messages for context
            sender = msg['sender']
            formatted_messages.append(f"{sender}: {msg['message']}")
        
        conversation_text = "\n".join(formatted_messages)
        
        # Prompt for Gemini
        prompt = f"""
        Analyze this conversation and check if it's becoming heated or toxic:
        
        {conversation_text}
        
        If the conversation is heated or contains toxic elements, provide a brief, friendly suggestion (1-2 sentences) 
        on how to de-escalate or improve the communication. The suggestion should be constructive and help 
        the person communicate more effectively without using harsh words.
        
        If the conversation is NOT heated or toxic, just respond with "NORMAL".
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        suggestion = response.text.strip()
        
        # If Gemini detected a heated conversation
        if suggestion != "NORMAL":
            return jsonify({
                'success': True, 
                'is_heated': True,
                'suggestion': suggestion
            })
        else:
            return jsonify({
                'success': True, 
                'is_heated': False
            })
            
    except Exception as e:
        print(f"Error analyzing conversation: {str(e)}")
        return jsonify({'success': False, 'message': 'Error analyzing conversation'}), 500

@app.route('/api/sugartalk', methods=['POST'])
def sugartalk():
    session_id = request.json.get('session_id')
    message = request.json.get('message')
    tone = request.json.get('tone')
    
    if session_id not in active_users:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    if not message:
        return jsonify({'success': False, 'message': 'No message provided'}), 400
        
    if not tone:
        return jsonify({'success': False, 'message': 'No tone specified'}), 400
    
    try:
        # Define tone descriptions and effects
        tone_descriptions = {
            'smooth_like_honey': {
                'name': '🧁 Smooth Like Honey',
                'tagline': 'Glides like charm.',
                'effect': 'Soft, calming, polite. Like a therapist in DMs.'
            },
            'sweet_and_subtle': {
                'name': '🍂 Sweet & Subtle',
                'tagline': 'You get your point across… without the sting.',
                'effect': 'Passive-aggressive but sugar-coated. Velvet sarcasm.'
            },
            'soft_serve': {
                'name': '🍦 Soft-Serve',
                'tagline': 'Sprinkle some kindness on it.',
                'effect': 'Complaints turned into compliments. Wholesome and kind.'
            },
            'berry_nice': {
                'name': '🍓 Berry Nice',
                'tagline': 'Extra friendly, zero drama.',
                'effect': 'Cheerful, casual, emoji-filled and very friendly.'
            },
            'spicy_sugar': {
                'name': '🌶️ Spicy Sugar',
                'tagline': 'Respectfully savage.',
                'effect': 'Clever, sassy, but never toxic. For confident roasting.'
            },
            'sugarcoat_it': {
                'name': '🍬 Sugarcoat It',
                'tagline': 'Say what you mean—just not meanly.',
                'effect': 'Gentle honesty. Great for feedback that won\'t hurt feelings.'
            },
            'bittersweet_truth': {
                'name': '💎 Bittersweet Truth',
                'tagline': 'Real talk, respectfully delivered.',
                'effect': 'Balanced tone. Honest but emotionally cooled down.'
            }
        }
        
        # Get tone description
        tone_info = tone_descriptions.get(tone)
        if not tone_info:
            return jsonify({'success': False, 'message': 'Invalid tone specified'}), 400
            
        # Check if message is heated/negative
        check_prompt = f"""
        Analyze this message and determine if it contains heated, negative, or potentially hurtful content:
        
        "{message}"
        
        If the message is heated, negative, or potentially hurtful, respond with "HEATED". 
        If the message is neutral or positive, respond with "NORMAL".
        """
        
        check_response = model.generate_content(check_prompt)
        is_heated = "HEATED" in check_response.text.strip().upper()
        
        # Get healthy conversation suggestion if message is heated
        health_suggestion = ""
        if is_heated:
            suggestion_prompt = f"""
            The following message appears heated or negative:
            
            "{message}"
            
            Provide ONE brief, helpful suggestion (1-2 sentences) on how to communicate more effectively
            without using harsh language. Focus on constructive communication techniques.
            """
            
            suggestion_response = model.generate_content(suggestion_prompt)
            health_suggestion = suggestion_response.text.strip()
            
        # Create prompt for Gemini
        prompt = f"""
        Transform the following message into a sweeter, more positive version using the "{tone_info['name']}" tone.
        
        Tone Description: {tone_info['effect']}
        Tagline: {tone_info['tagline']}
        
        Original message:
        "{message}"
        
        Please provide just ONE rewritten version of this message that expresses the same core meaning 
        but in a way that follows the tone's style. Make the transformation obvious and distinctive.
        The tone of voice should dramatically match the tone description.
        Keep the transformed message concise and to the point.
        DO NOT provide multiple options or variations - just the single best rewrite.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        transformed_message = response.text.strip()
        
        # Remove quotes if they exist
        if transformed_message.startswith('"') and transformed_message.endswith('"'):
            transformed_message = transformed_message[1:-1]
        
        return jsonify({
            'success': True,
            'original_message': message,
            'transformed_message': transformed_message,
            'tone': tone_info['name'],
            'is_heated': is_heated,
            'health_suggestion': health_suggestion
        })
            
    except Exception as e:
        print(f"Error transforming message: {str(e)}")
        return jsonify({'success': False, 'message': 'Error transforming message'}), 500

def get_chat_id(user1, user2):
    # Create a unique chat ID for two users (alphabetically sorted)
    users = sorted([user1, user2])
    return f"{users[0]}_{users[1]}"

@socketio.on('connect')
def handle_connect():
    session_id = request.args.get('session_id')
    if session_id not in active_users:
        return False  # Reject the connection
    
    username = active_users[session_id]
    online_users[username] = {'online': True, 'sid': request.sid}
    
    # Let everyone know this user is online
    emit('user_status', {'username': username, 'online': True}, broadcast=True)
    
    # Join user's personal room for private messages
    join_room(username)

@socketio.on('disconnect')
def handle_disconnect():
    session_id = request.args.get('session_id')
    if session_id in active_users:
        username = active_users[session_id]
        if username in online_users:
            del online_users[username]
        
        # Let everyone know this user is offline
        emit('user_status', {'username': username, 'online': False}, broadcast=True)
        
        # Leave user's personal room
        leave_room(username)

@socketio.on('private_message')
def handle_private_message(data):
    session_id = request.args.get('session_id')
    if session_id not in active_users:
        return
    
    sender = active_users[session_id]
    recipient = data['recipient']
    message_text = data['message']
    timestamp = data['timestamp']
    
    # Create message object
    message = {
        'sender': sender,
        'recipient': recipient,
        'message': message_text,
        'timestamp': timestamp
    }
    
    # Get chat ID
    chat_id = get_chat_id(sender, recipient)
    
    # Store message
    if chat_id not in private_messages:
        private_messages[chat_id] = []
    
    private_messages[chat_id].append(message)
    
    # Send to sender's room (so all their devices get it)
    emit('private_message', message, room=sender)
    
    # Send to recipient's room if they're online
    if recipient in online_users:
        emit('private_message', message, room=recipient)

if __name__ == '__main__':
    # Get local IP address to make it accessible on the network
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    print(f"Starting server on {local_ip}:5000")
    print("Access the chat app from any device on the same network using this address")
    
    # Run the app on 0.0.0.0 to make it accessible from other devices
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 