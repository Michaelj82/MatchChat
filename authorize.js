const clientID = '1110754146988085378'
const redirectUri = 'https://google.com'

const authorizationUrl = 'https://discord.com/api/oauth2/authorize?client_id=1110754146988085378&permissions=414464658496&redirect_uri=https%3A%2F%2Fwww.google.com%2F&response_type=code&scope=guilds%20guilds.join%20guilds.members.read%20activities.read%20activities.write%20dm_channels.read%20role_connections.write%20applications.commands.permissions.update%20relationships.read%20applications.builds.upload%20applications.builds.read%20messages.read%20applications.entitlements%20voice%20applications.store.update%20applications.commands%20webhook.incoming%20bot%20rpc.activities.write%20rpc.screenshare.write%20rpc.screenshare.read%20rpc.video.write%20rpc.video.read%20rpc.voice.write%20rpc.voice.read%20rpc.notifications.read%20rpc%20gdm.join%20connections%20email%20identify'

// Extract access token from url hash fragment

const params = window.location.hash.substring(1).split('&');

const accessToken = params.reduce((result, item) => {
    const [key, value] = item.split('=');
    if (key === 'access_token'){
        result = decodeURIComponent(value);
    }
    return result
}, '');

fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
})
    .then(response => response.json())
    .then(guilds => {
        if (guilds.length > 0){
            const guildId = guilds[0].id
            //another api request to retrieve channels of the guild
            fetch(`https://discord.com/api/v10/guilds${guildId}/channels`, {
                headers:{
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => response.json())
                .then(channels => {
                    const channelId = channels[0].id

                    console.log('Access token: ', accessToken)
                    console.log('Guild id: ', guildId)
                    console.log('Channel id: ', channelId)

                })
                .catch(error => {
                    console.error('failed to fetch channels: ', error)
                });

        }else{
            console.log(guilds)
            console.error('user not in guilds')
        }


        
    })
    .catch(error => {
        console.error('failed to fetch guilds: ', error)
    })




