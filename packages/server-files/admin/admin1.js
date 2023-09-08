require("../functions.js");
require("../auth.js"); 
 
//Admin help//
mp.events.addCommand('ah', (player) => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    player.call("show_admin_help", []);
});

//Save positions
mp.events.addCommand("save", (player, name = "No name") => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    const pos = (player.vehicle) ? player.vehicle.position : player.position;
    const rot = (player.vehicle) ? player.vehicle.rotation : player.heading;
    const saveFile = "savedpos.txt";
    const fs = require('fs');
    fs.appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | ${(player.vehicle) ? `Rotation: ${rot.x}, ${rot.y}, ${rot.z}` : `Heading: ${rot}`} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err) => {
        if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
        else player.notify(`~g~Position saved. ~w~(${name})`);
    }); 
});

//GasTank vehicle
mp.events.addCommand('gas', (player, gas) => {
    if(player.data.admin < 1)
        return player.staffPerms(1);
    gas = parseInt(gas); 
    player.vehicle.setVariable('vehicleGass', gas); 
    player.call("update_speedometer_gass", []);
});

//Car DL
mp.events.addCommand("dl", (player) => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    player.setVariable('dlActivated', !player.getVariable('dlActivated'));
    sendMessage(player, 'ff6600', `(Vehicle info):!{ffffff} Your vehicle informations is now ${(player.getVariable('dlActivated') == 1) ? ("!{09ed11}enabled") : ("!{ff4d4d}disabled!")}!{ffffff}.`);    
});

//Fix car
mp.events.addCommand("fv", (player) => {
    const vehicle = player.vehicle; 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!vehicle) return;
    vehicle.repair();
    vehicle.setVariable('vehicleGass', 100);
    player.call("update_speedometer_gass", []);
    player.call("showNotification", [`You fixed vehicle ${vehicle.id}.`]);
});

//Goto car
mp.events.addCommand("gotocar", (player, veh) => {
    const vehicle = mp.vehicles.at(veh);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!veh) return sendUsage(player, '/gotocar [vehicle id]');  
    if(!vehicle) 
        return player.outputChatBox(`This vehicle doesn't exist.`);
    ((!player.vehicle) ? player.position = new mp.Vector3(vehicle.position.x + 2.5, vehicle.position.y, vehicle.position.z) : player.vehicle.position = new mp.Vector3(vehicle.position.x + 2.5, vehicle.position.y, vehicle.position.z));
    ((!player.vehicle) ? player.dimension = vehicle.dimension : vehicle.dimension = player.dimension)
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} teleported to vehicle ${veh.id}.`);
});

//Get car
mp.events.addCommand("getcar", (player, veh) => {
    const vehicle = mp.vehicles.at(veh);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!veh) 
        return sendUsage(player, '/getcar [vehicle id]');  
    if(!vehicle) 
        return player.outputChatBox(`This vehicle doesn't exist.`);
    vehicle.position = new mp.Vector3(player.position.x + 2.5 , player.position.y, player.position.z);
    vehicle.dimension = player.dimension; 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} teleported vehicle ${veh} to him.`);
});

//Flip car
mp.events.addCommand("flip", (player) => {
    const vehicle = player.vehicle; 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!vehicle) 
        return;
    vehicle.rotation = new mp.Vector3(0, 0, vehicle.rotation.z);   
    player.call("showNotification", [`You fliped vehicle ${vehicle.id}.`]);
});

//Create vehicle
mp.events.addCommand('veh', (player, _, vehName) => {
    
    if(player.data.admin < 1) 
        return player.staffPerms(1);    
    if(!vehName) 
        return sendUsage(player, `/veh [vehicle_name]`);
    const admVehicle = player.createVehicle(player, vehName, player.position, generateRGB(), generateRGB(), player.heading);
    if(!player.vehicleValid(vehName))
        return sendMessage(player, 'ff3300', `ERROR:!{ffffff} This vehicle doesn't exist.`);     
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} spawned a ${vehName}.`);
});  

//Destroy vehicle
mp.events.addCommand('vre', (player, _, veh) => {
    const vehID = mp.vehicles.at(veh); 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if((!veh || isNaN(veh)) && !player.vehicle) 
        return sendUsage(player, `/vre [vehicle_id]`);
    if(!player.vehicle && vehID == undefined)
        return sendMessage(player, 'ff3300', `ERROR:!{ffffff} This vehicle doesn't exist.`); 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} destroyed a vehicle [id: ${((player.vehicle) ? player.vehicle.id : vehID.id)}].`);
    //DESTROY VEHICLE
    ((player.vehicle) ? player.vehicle : vehID).destroy(); 
}); 

//Warn player
mp.events.addCommand('warn', (player, _, id, ...reason) => {   
    const user = getNameOnNameID(id); 
    reason = reason.join(" ");
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!id || !reason || reason.length <= 0) 
        return sendUsage(player, '/warn [player] [reason]'); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
    if(user.data.playerWarns === 3)
        return sendMessage(player, 'ffffff', `This player already have 3/3 warns.`);  
    if(user.data.playerWarns < 3 && user.data.playerWarns >= 0){
        user.data.playerWarns ++;
        sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${user.name} has been warned by ${player.name} reason: ${reason} (warns: ${user.data.playerWarns}/3).`);
        mysql_action('UPDATE `accounts` SET playerWarns = ? WHERE username = ?', [user.data.playerWarns, user.name]);
    }
});

//Remove warn 
mp.events.addCommand('unwarn', (player, _, id, ...reason) => {   
    const user = getNameOnNameID(id);
    reason = reason.join(" ");
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!id || !reason || reason.length <= 0) 
        return sendUsage(player, '/unwarn [player] [reason]'); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);  
    if(user.data.playerWarns == 0)
        return sendMessage(player, 'ffffff', `This player already have 0/3 warns.`);  
    user.data.playerWarns --; 
    sendAdmins(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} remove 1 warn from ${player.name} reason: ${reason} (warns: ${player.data.playerWarns}/3).`);
    mysql_action('UPDATE `accounts` SET playerWarns = ? WHERE username = ?', [user.data.playerWarns, user.name]);
});

//Private message
mp.events.addCommand('pm', (player, _, id, ...message) => {
    const user = getNameOnNameID(id); 
    message = message.join(" ");
    if(player.data.admin < 1)  
        return player.staffPerms(1);
    if(!id || !message) 
        return sendUsage(player, '/pm [player] [text]'); 
    if(player.name == user.name)
        return sendMessage(player, 'ffffff', `You can not send private message to yourself.`); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
    sendMessage(player, 'ffff00', `(( PM sent to ${user.name}: ${message} )).`);
    sendMessage(user, '67aab1', `(( PM from ${player.name}: ${message} )).`);
});  

//Admin chanel
mp.events.addCommand('a', (player, args) => { 
    if(player.data.admin < 1)  
        return player.staffPerms(1);
    if(!args) 
        return sendUsage(player, `/a [text]`); 
    sendAdmins('ffc35a', `Admin ${player.data.admin} ${player.name}: ${args}`);
}); 

//Mute player
mp.events.addCommand("mute", (player, _, playerID, minutes, ...reason) => { 
    const user = getNameOnNameID(playerID);  
    if(player.data.admin < 1)  
        return player.staffPerms(1);
    if(!playerID || !minutes) 
        return sendUsage(player, '/mute [player] [minutes] [reason]'); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    if(user.name == player.name)
        return sendMessage(player, 'ffffff', 'You can not mute yourself.')
    user.data.mute = minutes * 60;
    sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} muted ${player.name} for ${minutes} ${minutes > 1 ? 'minutes' : 'minute' }. ( Reason: ${reason} )`);
    mysql_action('UPDATE `accounts` SET mute = ? WHERE username = ?', [user.data.mute, user.name]); 
}); 

//Unmute player
mp.events.addCommand("unmute", (player, playerID) => {  
    const user = getNameOnNameID(playerID); 
    if(player.data.admin < 1)  
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/unmute [player]');  
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    if(user.data.mute == 0) 
        return player.outputChatBox("This player is not muted.");
    user.data.mute = 0;
    sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} unmuted ${user.name}.`);
    mysql_action('UPDATE `accounts` SET mute = ? WHERE username = ?', [0, user.name]); 
}); 

//Set dimension (virtual world)
mp.events.addCommand("setdimension", (player, _, playerID, dimension) => {
    const user = getNameOnNameID(playerID); 
    if(player.data.admin < 1)  
        return player.staffPerms(1);
    if(!playerID || !dimension) 
        return sendUsage(player, '/setdimension [player] [dimension]');   
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    user.dimension = parseInt(dimension);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] set ${user.name}'s dimenstion in ${user.dimension}.`);
}); 

//Spec player
mp.events.addCommand("spec", (player, playerID) => {
    const user = getNameOnNameID(playerID);   
    if(player.data.admin < 1)
        return player.staffPerms(1); 
    if(!playerID) 
        return sendUsage(player, '/spec [player]'); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] spectate ${user.name}.`);
}); 

//Heal player
mp.events.addCommand("heal", (player, id) => {
    const user = getNameOnNameID(id);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!id)
        return sendUsage(player, '/heal [id]'); 
    if(user == undefined)
        return player.outputChatBox("This player is not connected.");
    user.health = 100;
    user.call('openPlayerHud', [user.formatMoney(user.data.money, 0), user.formatMoney(user.data.moneyBank, 0), user.health, user.armour, user.data.hunger, user.data.thirst, user.data.hudStatus]);  
    player.call("showNotification", [`You reseted ${user.name} health.`]);
    user.call("showNotification", [`${player.name} reset your health.`]);
});

//Kill player
mp.events.addCommand("kill", (player, id) => {
    const user = getNameOnNameID(id);
    if(player.data.admin < 1)
        return player.staffPerms(1);
    if(!id)
        return sendUsage(player, '/kill [id]');
    if(user == undefined)
        return player.outputChatBox("This player is not connected.");
    user.health = 0;
    user.call('openPlayerHud', [user.formatMoney(user.data.money, 0), user.formatMoney(user.data.moneyBank, 0), user.health, user.armour, user.data.hunger, user.data.thirst, user.data.hudStatus]);  
    player.call("showNotification", [`You kill ${user.name}.`]);
    user.call("showNotification", [`${player.name} kill you.`]);
});

//Respawn player
mp.events.addCommand('respawn', (player, target) => {
    const user = getNameOnNameID(target);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!target) 
        return sendUsage(player, '/respawn [player]'); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
    mp.events.call("spawnPlayer", user, -1); 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} respawned ${user.name}.`);
    sendMessage(user, 'ff6633', `Admin ${player.name} respawned you.`);
});

//Goto player
mp.events.addCommand('goto', (player, playerID) => {
    const user = getNameOnNameID(playerID); 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/goto [player]'); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    player.position = new mp.Vector3(user.position.x + 1, user.position.y, user.position.z);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/goto) on ${user.name}.`);
    sendMessage(user, '669999', `${player.name} teleported to you.`);
});

//Get player
mp.events.addCommand('gethere', (player, _, playerID) => {
    const user = getNameOnNameID(playerID);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/gethere [player]'); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    user.position = new mp.Vector3(player.position.x + 1, player.position.y, player.position.z);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/gethere) on ${user.name}.`);
    sendMessage(user, '669999', `${player.name} teleported you to him.`);
});

//Freeze player
mp.events.addCommand("freeze", (player, _, playerID) => {
    const user = getNameOnNameID(playerID);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/freeze [player]'); 
    if(user == undefined)  
        return player.outputChatBox("This player is not connected.");
    user.call('freezePlayer', [true]);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} freeze ${user.name}.`);
});

//Unfreeze player  
mp.events.addCommand("unfreeze", (player, _, playerID) => {
    const user = getNameOnNameID(playerID);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/unfreeze [player]'); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    user.call('freezePlayer', [false]);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} unfreeze ${user.name}.`);
});

//Slap player
mp.events.addCommand("slap", (player, _, playerID) => {
    const user = getNameOnNameID(playerID);
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!playerID) 
        return sendUsage(player, '/slap [player]');     
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    user.position = new mp.Vector3(user.position.x, user.position.y, user.position.z + 2.5); 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} slap ${user.name}.`);
});

//Mark point
mp.events.addCommand("mark", (player) => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    player.data.markPosition = player.position;
    player.notify('You ~b~marked ~w~this position!');
});

//Goto mark point 
mp.events.addCommand("gotomark", (player) => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!player.data.markPosition) 
        return player.outputChatBox(`You don't have a marked position.`);
    ((!player.vehicle) ? player.position = player.data.markPosition : player.vehicle.position = player.data.markPosition); 
    player.dimension = 0;
});

//Give gun player
mp.events.addCommand('givegun', (player, _, id, gunName, buletts) => {  
    const user = getNameOnNameID(id);  
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!id || !gunName) 
        return sendUsage(player, `/givegun [id] [weapon_name] [number_bullets]`);    
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
    user.giveWeapon(mp.joaat(gunName), parseInt(buletts)); 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} spawned ${gunName} with ${parseInt(buletts)} bullets for ${user.name}.`);
    sendMessage(user, 'ffffff', `${player.name} spawned ${gunName} with ${parseInt(buletts)} for you.`);
});  

//Disarm player
mp.events.addCommand('disarm', (player, id) => { 
    const user = getNameOnNameID(id); 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    if(!id) 
        return sendUsage(player, `/disarm [player]`);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
    user.removeAllWeapons();
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} disarmed ${user.name}.`);
}); 

