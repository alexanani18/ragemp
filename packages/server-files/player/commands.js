require("../functions.js");
require("../auth.js");
   
var mysql = require('mysql');   
var struct = require('../struct.js');

 
mp.events.add('playerCommand', (player, command) => {        
    player.outputChatBox(`${command} is not a valid command, use /help to find a list of commands.`);
});
 
mp.events.add("givePlayerExperience", (player, experienceToGive) => {

    player.data.experience = player.data.experience + experienceToGive;
      
    sendMessage(player, 'ffcc00', `You received ${experienceToGive} experience (total ${player.data.experience}, need ${player.data.needExperience} for next level ${player.data.level + 1}).`); 

    if(player.data.experience >= player.data.needExperience)
    {
        let lastExperience = player.data.needExperience;

        player.data.experience = parseInt(0);
        player.data.needExperience = player.data.needExperience + parseInt(300);
        player.data.level ++;
 
        sendMessage(player, '00cc66', `(Next level):!{ffffff} You advanced to level ${player.data.level} because you accumulated ${lastExperience} experience.`); 
    }
 
    mysql_action('UPDATE `accounts` SET level = ?, experience = ?, needExperience = ? WHERE username = ?', [player.data.level, player.data.experience, player.data.needExperience, player.name]); 
});

//Player commands   
mp.events.add("deschideTab", (player) => {  
 
    let tabString = '';
    let total_players = 0;
  
    mp.players.forEach(users => {
        if(users.loggedInAs == true)
        { 
            tabString += `<tr><td>#${users.id}</td><td>${users.name}${(users.data.admin > 0) ? ('<br><span class="badge badge-pill badge-success float-center">admin</span>') : ("")}</td><td>${(users.data.playerGroup == -1) ? ('none') : (struct.group[users.data.playerGroup].groupName)}</td><td>${users.getGender(player.data.gender)}</td><td>${users.ping}</td></tr>`; 
            
            total_players ++;
        }   
    }); 

    player.call((player.getVariable('playerTabOpened') == 1) ? ("closeStatsBrowser") : ("showTabBrowser"), [tabString, total_players]);  
    player.setVariable('playerTabOpened', !player.getVariable('playerTabOpened'));    
    return;
});
  
mp.events.addCommand('timestamp', (player) => { 
  
    player.data.timeStamp = !player.data.timeStamp;
    sendMessage(player, 'ffffff', `Timestamp is now ${(player.data.timeStamp == 1) ? ("!{09ed11}enabled") : ("!{ff4d4d}disabled!")}`); 
});  
  
///////////////////////////////////////////////////////////////// SHOP SISTEM /////////////////////////////////////////////////////////////////   
mp.events.add("load_shop_items", (player, itemType, itemName, itemAmount, itemPrice, payType) => {  

    //VERIFFICATION
    if((player.data.money < itemPrice && payType == 2) || (player.data.moneyBank < itemPrice && payType == 1)) 
        return player.call("showNotification", ["You don`t have this money."]);
 
    //GIVE ITEM
    mp.events.call("givePlayerItem", player, true, itemType, itemAmount, itemName, -1); 
 
    //REMOVE MONEY
    (payType == 1) ? (player.give_money_bank(1, itemPrice)) : (player.giveMoney(1, itemPrice))

    //MESSAGE
    sendMessage(player, '0AAE59', `(Shop):!{ffffff} You purchase a ${itemName} for !{ff4d4d}${player.formatMoney(itemPrice, 0)}!{ffffff}$ (with ${(payType == 1) ? ("!{3AAED8}Card") : ("!{0AAE59}Cash")}!{ffffff}).`);
});

mp.events.addCommand('info', (player) => { 
 
    player.data.hudStatus = !player.data.hudStatus;

    //NOTIFFICATION
    player.call("showNotification", [`You ${(player.data.hudStatus == 1) ? ("enabled") : ("closed")} info hud.`]);

    //MYSQL
    mysql_action('UPDATE `accounts` SET hudStatus = ? WHERE username = ? LIMIT 1', [player.data.hudStatus, player.name]);

    //UPDATE HUD
    player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]);  
});  


mp.events.addCommand("playanim", (player, fullText, dict, name, id) => {
    if(dict == undefined || name == undefined || id == undefined) return sendMessage(player, '0AAE59', '/playanim [dict] [name] [id]');
    play_animation(player, dict, name, 1, parseInt(id));
});

mp.events.addCommand("facial", (player, fullText, dict, name) => {
    if(dict == undefined || name == undefined) return sendMessage(player, '0AAE59', '/playanim [dict] [name] [id]');

    player.call("play_facial_anim", [player, dict, name]);  
   
});
  
//ENTITY
mp.events.add('apply_entity_select', (player, id, title) => {

    //-------------------------------------------- [EMOTES] --------------------------------------------//
    switch(id)
    {
        case "handsup": play_animation(player, "mp_bank_heist_1", "guard_handsup_loop", 1, 49); break; 
        case "dance": play_animation(player, "anim@amb@nightclub@dancers@crowddance_groups@", "mi_dance_crowd_17_v2_male^3", 1, 39); break; 
        case "peace": play_animation(player, "mp_player_int_upperpeace_sign", "mp_player_int_peace_sign_exit", 1, 2); break; 
        case "middlefinger": play_animation(player, "anim@mp_player_intcelebrationmale@finger", "finger", 1, 1); break; 
        case "stop": play_animation(player, "mini@strip_club@idles@bouncer@stop", "stop", 1, 1); break; 
        case "salute": play_animation(player, "anim@mp_player_intcelebrationmale@salute", "salute", 1, 1); break; 
    } 
});
 
function play_animation(player, dict, name, speed, flag)
{ 
    player.playAnimation(dict, name, speed, flag)
 
    setTimeout(() => {player.stopAnimation()}, 5000);
}

 
mp.events.add('click_entity', (player, entityX, entityY, hitEntity) => {

    sendMessage(player, '0AAE59', `X: ${entityX} and Y: ${entityY} (Entity: ${hitEntity})`);   
});
