"use strict";
 
var struct = require('./struct.js'); 
 
mp.events.add("checkPlayerGrades", (playerid) => {

    if(playerid.data.admin > 0)
    {
        sendMessage(playerid, '00cc66', `>> GRADES:!{ffffff} You are connected with admin level ${playerid.data.admin} and helper level ${playerid.data.helper}.`);  
    } 
});  
 
mp.events.add("showPlayerSetOptions", (playerid) => {

    sendUsage(playerid, '/set [player] [option] [amount]'); 
    sendMessage(playerid, '009999', 'Options:!{ffffff} experience, level, money, bankMoney, hours, dimension.');
});  
 
mp.events.add("checkPlayerStatistics", (player, target) => { 
    let x = player.data.house;
    let textHouse = 'no';
 
    if(player.data.house == 999) textHouse = 'no';
    else if(player.data.house < 999 && struct.houses[x].houseOwner == player.name) textHouse = `owned (${struct.houses[x].houseID})`;
    else if(player.data.house < 999 && struct.houses[x].houseOwner != player.name) textHouse = `rented (${struct.houses[x].houseID})`;
   
    player.outputChatBox(`----------------------------------------------------------------------------`);
 
    sendMessage(player, 'ff9900', `(General):!{ffffff} Name: ${target.name} (${player.id}) | Level: ${target.data.level} (experience ${target.data.experience} / ${target.data.needExperience}) Hours played: ${target.data.hours}`);
    sendMessage(player, 'ff9900', `(Financial):!{ffffff} Money: ${target.data.money} (bank: ${target.data.moneyBank}) Premium points: ${target.data.premiumPoints}`);
    sendMessage(player, 'ff9900', `(Properties):!{ffffff} House: ${textHouse}`);

    player.outputChatBox(`----------------------------------------------------------------------------`);
});     