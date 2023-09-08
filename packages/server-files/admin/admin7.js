require("../functions.js");
require("../auth.js"); 

//Set admin
mp.events.addCommand('setadmin', (player, _, id, adminLevel) => { 
    const user = getNameOnNameID(id);
    if(player.data.admin < 7) 
        return player.staffPerms(7);
    if(!id || !adminLevel) 
        return sendUsage(player, `/setadmin [player] [admin]`);
    if(adminLevel < 0 || adminLevel > 7) 
        return sendMessage(player, 'ffffff', `Maxium level is 7 and minim level is 0.`);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
    user.data.admin = parseInt(adminLevel);
    sendMessage(player, COLOR_ADMIN, `(Notice):!{ffffff} You promoted ${user.name} to admin level ${user.data.admin}.`);
    sendMessage(user, COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} promoted you to admin level ${user.data.admin}.`);
    mysql_action('UPDATE `accounts` SET admin = ? WHERE username = ?', [user.data.admin, user.name]);
}); 
 