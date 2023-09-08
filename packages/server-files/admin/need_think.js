require("../functions.js");
require("../auth.js"); 

//Show admin and helpers  
mp.events.addCommand('admins', (player) => {
    let counter_admins = 0;
    sendMessage(player, 'ff9900', `Online admins:`);
    mp.players.forEach(_player => {
        if(_player.data.admin > 0) 
        {
            sendMessage(player, 'FFFFFF', `${_player.name} [${_player.id}] - admin level ${_player.data.admin}`);
            counter_admins ++;
        }
    });
    sendMessage(player, 'ff9900', `Admins online: ${counter_admins}`);
});

