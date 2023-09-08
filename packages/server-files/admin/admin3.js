require("../functions.js");
require("../auth.js"); 

//Clear chat
mp.events.addCommand('clearchat', (player) => {
    if(player.data.admin < 3)  
        return player.staffPerms(3);
    mp.players.forEach(_player => {
        if(_player.loggedInAs == true) 
        {
            _player.call("ClearChatBox", []);
        }
    }); 
    sendToAll('ff3300', `(( Anno: ${player.name} cleared chat. ))`); 
});  
 
//Anno function
mp.events.addCommand('anno', (player, message) => {
    if(player.data.admin < 3)  
        return player.staffPerms(3);
    if(!message) 
        return sendUsage(player, '/anno [text]'); 
    sendToAll('ff3300', `(( Anno: ${message} ))`); 
});  