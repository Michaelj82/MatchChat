const clientID = '1110754146988085378'
const redirectUri = 'https://google.com'

const authorizationUrl = 'https://discord.com/api/oauth2/authorize?client_id=1110754146988085378&permissions=2147534912&redirect_uri=https%3A%2F%2Fwww.google.com%2F&response_type=code&scope=identify%20guilds%20gdm.join%20rpc.voice.read%20rpc.video.write%20rpc.activities.write%20messages.read%20applications.commands%20activities.read%20voice%20applications.commands.permissions.update%20dm_channels.read%20activities.write%20applications.builds.upload%20rpc.screenshare.read%20rpc.voice.write%20rpc%20guilds.join%20email%20bot%20applications.store.update%20role_connections.write%20relationships.read%20applications.builds.read%20webhook.incoming%20applications.entitlements%20rpc.screenshare.write%20rpc.video.read%20guilds.members.read%20connections%20rpc.notifications.read'
// Extract access token from url hash fragment

const params = window.location.hash.substring(1).split('&');

const TOKEN = params.reduce((result, item) => {
    const [key, value] = item.split('=');
    if (key === 'access_token'){
        result = decodeURIComponent(value);
    }
    return result
}, '');

const DISCORD_API_URL = 'https://discord.com/api/v10'
const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json"
const GUILD_ID = '1110757419644100649'
const CHANNEL_ID = '1110757420256481315'


// dom elements
const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');


// websocket connection

const socket = new WebSocket(GATEWAY_URL);
socket.addEventListener('message', handleGatewayMessage)

//Event listeners

sendButton.addEventListener('click', sendMessage)

//functions

function handleGatewayMessage(event){
    const message = JSON.parse(event.data);

    // Handle diff message types
    switch (message.op){
        case 10:
            socket.send(JSON.stringify({
                op:2,
                d: {
                    token: TOKEN,
                    intents: 513,
                    properties: {
                        $os: 'windows',
                        $browser: 'chrome',
                        $device: 'chrome'
                    }
                }
            }));
            break;
        case 0:
            if (message.t === 'MESSAGE_CREATE'){
                const chatMessage = message.d;
                displayChatMessage(chatMessage);

            }
            break;

        case 9:
            //reconnect if sesion invalidated
            socket.send(JSON.stringify({
                op:6,
                d: {
                    token: TOKEN,
                    session_id: message.d.session_id,
                    seq: message.s
                }
            }));
            break;
    }
}

// Function to display chat msgs

function displayChatMessage(message){
    const messageElement = document.createElement('p');
    messageElement.textContent = `${message.author.username}: ${message.content}`;
    chatDisplay.appendChild(messageElement)

}

// function to send a message to the discord chat

function sendMessage(){
    const message = messageInput.value;
    if (message.trim() !== ''){
        fetch(`${DISCORD_API_URL}/channels/${CHANNEL_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON
        })
    }
}