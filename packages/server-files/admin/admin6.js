require("../functions.js");
require("../auth.js"); 
 
//TIME AND WEATHER COMMANDS
let TimeOfDay = null;
mp.events.addCommand("settime", (player, time) => {
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!time)
        return sendUsage(player, `/settime [time]`);
    setTimeOfDay(parseInt(time));
    sendMessage(player, COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} changed the time of day to ${time}:00.`);
});
 
global.setTimeOfDay = function(time) 
{ 
    TimeOfDay = time;
    if(time == 24) 
        TimeOfDay = null; 
    setWorldWeatherAndTime();
}
function setWorldWeatherAndTime() 
{
    const date = 
        new Date(), 
        hours = date.getHours(),  
        minutes = date.getMinutes(), 
        seconds = date.getSeconds(); 
    mp.world.time.set(((TimeOfDay != null) ? (TimeOfDay) : (hours)), minutes, seconds);
}

//Give a car
mp.events.addCommand('givecar', (player, _, id, model) => {
    const user = getNameOnNameID(id);
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!model || !id)
        return sendUsage(player, `/givecar [player] [vehicle_model]`);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);  
    give_player_vehicle(user, model, 1, player.name);
    player.call("showNotification", [`Vehicle ${model} created for ${user.name} [${user.id}]`]);
});

//Set//
mp.events.addCommand('set', (player, _, id, type, amount) => { 
    const user = getNameOnNameID(id);
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!id || !type || !amount) 
        return mp.events.call("showPlayerSetOptions", player);  
    if(user == undefined) 
        return sendMessage(player, 'ffffff', 'This player is not connected.');
    amount = parseInt(amount);
    switch(type)
    {
        case "experience":
        {
            mp.events.call("givePlayerExperience", user, amount);
            break;
        }
        case "level": user.data.level = amount; break;
        case "money": user.giveMoney(2, amount); break;
        case "moneyBank": user.data.moneyBank = amount; break;
        case "hours": user.data.hours = amount; break;
        case "virtualworld": user.dimension = amount; break;
    } 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s ${type} in ${amount}.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set your ${type} in ${amount}.`);
    mysql_action('UPDATE `accounts` SET experience = ?, level = ?, money = ?, moneyBank = ? WHERE username = ?', [user.data.experience, user.data.level, user.data.money, user.data.moneyBank, user.name]); 
});  

//Set licenses 
mp.events.addCommand('setlicense', (player, _, id, type, amount) => { 
    const user = getNameOnNameID(id);
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!id || !type || !amount) 
    {
        sendUsage(player, '/setlicense [player] [license] [amount]'); 
        sendMessage(player, '009999', 'Options:!{ffffff} driving, boat, fly, gun.');
        return;
    }
    if(user == undefined) 
        return sendMessage(player, 'ffffff', 'This player is not connected.');
    amount = parseInt(amount);
    if(amount > 500 || amount < 0)
        return sendMessage(player, 'ffffff', 'Please use value from 0 to 500 hours.');
    switch(type)
    {
        case "driving": 
            user.data.drivingLicense = amount; 
            mysql_action('UPDATE `accounts` SET drivingLicense = ? WHERE username = ?', [user.data.drivingLicense, user.name]);
            break; 
        case "boat": 
            user.data.boatLicense = amount; 
            mysql_action('UPDATE `accounts` SET boatLicense = ? WHERE username = ?', [user.data.boatLicense, user.name]);
            break; 
        case "fly": 
            user.data.flyLicense = amount;
            mysql_action('UPDATE `accounts` SET flyLicense = ? WHERE username = ?', [user.data.flyLicense, user.name]);
            break; 
        case "gun":
            user.data.gunLicense = amount;
            mysql_action('UPDATE `accounts` SET gunLicense = ? WHERE username = ?', [user.data.gunLicense, user.name]);
            break; 
    }
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s license of ${type} in ${amount}.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set you license ${type} in ${amount}.`);   
});

//agl (give all licenses)
mp.events.addCommand('agl', (player, _, id) => {
    const user = getNameOnNameID(id);
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!id) 
    {
        sendUsage(player, '/agl [id]'); 
        return;
    }
    if(user == undefined) 
        return sendMessage(player, 'fc0303', 'This player is not connected.');
    mysql_action('UPDATE `accounts` SET drivingLicense = 500 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET boatLicense = 500 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET flyLicense = 500 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET gunLicense = 500 WHERE username = ?', [user.name]);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s all licenses availability with 500 hours.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set you licenses availability with 500 hours.`);   
});

//ragl (remove all license)
mp.events.addCommand('ragl', (player, _, id) => {
    const user = getNameOnNameID(id); 
    if(player.data.admin < 6) 
        return player.staffPerms(6);
    if(!id) 
    {
        sendUsage(player, '/ragl [id]'); 
        return;
    }
    if(user == undefined) 
        return sendMessage(player, 'fc0303', 'This player is not connected.');
    mysql_action('UPDATE `accounts` SET drivingLicense = 0 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET boatLicense = 0 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET flyLicense = 0 WHERE username = ?', [user.name]);
    mysql_action('UPDATE `accounts` SET gunLicense = 0 WHERE username = ?', [user.name]);
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s all licenses availability with 0 hours.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set you licenses availability with 0 hours.`);   
});

//Add vehicle to DS
mp.events.addCommand('addvehDS', (player, _, vehicle, price, stock) => {
    if(player.data.admin < 6)
        return player.staffPerms(6)

    if(!vehicle || !price || !stock)
        return sendUsage(player, '/addvehDS [model] [price] [stock]');
        
    loaded_dealer_vehicles = loaded_dealer_vehicles + 1; //Update total vehicles  
     
    gm.mysql.handle.query('INSERT INTO `server_dealership_vehicles` SET dealerModel = ?, dealerPrice = ?, dealerStock = ?', [vehicle, price, stock], function(err, res) {

        if(err)
            return console.log(`Error: ${err}`);

        sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} added a ${model} in Dealership (stock: ${stock} price: ${price}$).`); 
    });
}); 