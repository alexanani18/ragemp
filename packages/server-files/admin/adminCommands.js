require("../functions.js");
require("../auth.js"); 
   
const mysql = require('mysql');   
 
//Admins command  
 
mp.events.addCommand('ah', (player) => {

    if(player.data.admin < 1) 
        return player.staffPerms(1);
 
  
    player.call("show_admin_help", []);
});
   
mp.events.addCommand('set', (player, _, id, type, amount) => { 
    
    if(player.data.admin < 6) 
        return player.staffPerms(6);
   
    if(!id || !type || !amount) 
        return mp.events.call("showPlayerSetOptions", player); 

    const user = getNameOnNameID(id); 
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

    //MESSAGES
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s ${type} in ${amount}.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set your ${type} in ${amount}.`);
 
    //MYSQL
    mysql_action('UPDATE `accounts` SET experience = ?, level = ?, money = ?, moneyBank = ? WHERE username = ?', [user.data.experience, user.data.level, user.data.money, user.data.moneyBank, user.name]); 
});  

mp.events.addCommand('setlicense', (player, _, id, type, amount) => { 
    
    if(player.data.admin < 6) 
        return player.staffPerms(6);

    if(!id || !type || !amount) 
    {
        sendUsage(player, '/setlicense [player] [license] [amount]'); 
        sendMessage(player, '009999', 'Options:!{ffffff} driving, boat, fly, gun.');
        return;
    }

    const user = getNameOnNameID(id);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', 'This player is not connected.');

    amount = parseInt(amount);

    if(amount > 500 || amount < 0)
        return sendMessage(player, 'ffffff', 'Please use value 0 and 500 h.');
 
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
        case "fly":  break; 
        case "gun":  break; 
    }
 
    //MESSAGE
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} set ${user.name}'s license of ${type} in ${amount}.`);
    sendMessage(user, COLOR_GLOBAL, `(Info):!{ffffff} ${player.name} set you license ${type} in ${amount}.`);   
});
 
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

mp.events.addCommand('gas', (player, gas) => { 
 
    player.vehicle.setVariable('vehicleGass', 50); 

    player.call("update_speedometer_gass", []);
});

 
  
 

 

  
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

mp.events.addCommand('helpers', (player) => {
    let counter_helpers = 0;
    sendMessage(player, 'ff9900', `Online helpers:`);
    mp.players.forEach(_player => 
    {
        if(_player.data.helper > 0) {
            sendMessage(player, 'FFFFFF', `${_player.name} [${_player.id}] - helpers level ${_player.data.helper}`);
            counter_helpers++;
        }
    });
    sendMessage(player, 'ff9900', `Helpers online: ${counter_helpers}`);
}); 
  

//BAN and KICK sistem 
mp.events.addCommand('kick', (player, target) => { 
    
    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!target || isNaN(target)) 
        return sendUsage(player, '/kick [player]'); 

    const user = getNameOnNameID(target); 
    if(user === undefined) 
        return player.outputChatBox("There is no player online with the ID given.")

    sendToAll('b30000', `(/kick): ${user.name} has been kicked from the server by admin ${player.name}.`);
    user.kick('Kicked.');
});
 
mp.events.addCommand('ban', (player, _, target, ...reason) => { 
    reason = reason.join(" ");

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!target || isNaN(target)) 
        return sendUsage(player, '/ban [player] [reason]'); 
  
    const user = getNameOnNameID(target); 
    if(user === undefined) 
        return player.outputChatBox("There is no player online with the ID given.")
 
    gm.mysql.handle.query('INSERT INTO `server_bans` SET banPlayer = ?, banSocialID = ?, banAdmin = ?, banReason = ?, banDate = ?', [user.name, user.socialClub, player.name, reason, getDates()], function(err, res) {
        if(err) 
        {
            console.log(err); 
            player.call("showNotification", [`[ERROR MYSQL] Try again.`]);
            return;
        } 

        sendMessage(user, 'ff3300', `(BANNED):!{ffffff} You are banned from this server by admin ${player.name} reason: ${reason} (!{ff3300}SOCIAL CLUB BANNED!{ffffff}).`);
        //user.ban('Banned.'); 
    });  
});
 
mp.events.addCommand('cauta', (player) => { 

    checkBans(player); 
});


function checkBans(player)
{
    gm.mysql.handle.query('SELECT * FROM `server_bans` WHERE `contactAddBy` = ? AND `banSocialID` = ?', [player.name, player.socialClub], function(err, results) { 
     
        for(let i = 0; i < results.length; i++) {
             
            sendMessage(player, 'ffffff', `<<< !{ff3300}(BANNED):!{ffffff} >>>`);
            sendMessage(player, 'ffffff', `You are banned from this server at date !{ff3300}${results[i].banDate}!{ffffff} by admin ${results[i].banAdmin} reason: !{ff3300}${results[i].banReason}!{ffffff}.`);
        }  
    });  
} 

//Reports sistem
mp.events.addCommand('report', (player) => { 

    player.call("showReportSend", []);

});

mp.events.addCommand('reports', (player) => { 

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    loadReports(player);

});
 
mp.events.add("sendReportInfo", (player, button, reportPlayer, reportDetails, reportPriority) => {

    if(button == 1)
    {
        const reportedID = getNameOnNameID(reportPlayer);

        //Veriffications
        if(player.data.haveReport == true)
            return player.call("showNotification", [`You already have a report.`]);

        if(reportedID == undefined)
            return player.call("showNotification", [`This player is not connected.`]);

        if(reportPriority == 0)
            return player.call("showNotification", [`Select report priority.`]);

        //Update CEF
        adminsUpdateCef();

        //Close player CEF
        player.call("destroySendReport", []);
        player.setVariable('playerMenuOpen', false);
 
        //Set variables
        player.data.haveReport = true;
        player.data.reportDetails = reportDetails;
        player.data.reportPriority = reportPriority;
        player.data.reportDate = getDates();
        player.data.reportTo = reportedID;
        player.data.reportStaus = 'waiting';
        player.data.reportAccesedBy = 'none';

        //Colors
        var color = "!{ffcc00}";      
        if(reportPriority == "medium") color = "!{009933}";
        if(reportPriority == "high") color = "!{ff4d4d}";
 
        //Send messages
        sendMessage(player, COLOR_RED, `(Report):!{ffffff} Your report has been sent. Please wait until an administrator respond.`); 
        sendMessage(player, COLOR_RED, `(Report):!{ffffff} Report description: ${reportDetails} (priority: ${color}${reportPriority}!{ffffff}).`);  
    } 
});

mp.events.add("sendReportPackage", (player, button, playerID, closeReason) => {

    const reportedID = getNameOnNameID(playerID);
    
    switch(button)
    {
        case 0: break;
        
        //Button for show more
        case 1:
        {  
            player.call("showMoreModal", [0, reportedID.data.reportDetails]);
            break;
        }

        //Button for open/close
        case 2:
        {  
            //If report is already opened and click report is closed.
            if(reportedID.data.reportStaus == 'opened')
            {  
                //Veriffication
                if(reportedID.data.reportAccesedBy != player.name)
                    return player.call("showNotification", [`This report is already taken by someone.`]);
 
                //Execute reason modal
                player.call("showMoreModal", [2, `<button type = "button" class = "btn btn-outline-success btn-block btn-sm" onclick = "clickReport(5, ${reportedID.id});">Send reason <i class = "fa fa-check" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-danger btn-block btn-sm" class = "close" data-dismiss = "modal" aria-label = "Close">Close <i class = "fa fa-close" aria-hidden = "true"></i></button>`]); 
            }
            else 
            {
                //Veriffication
                if(reportedID.data.reportStaus == 'opened')
                    return player.call("showNotification", [`This report is already taken by someone.`]);

                //Update variables
                reportedID.data.reportStaus = 'opened'; 
                reportedID.data.reportAccesedBy = player.name
 
                //Update CEF browser
                adminsUpdateCef();  
                
                //Send notiffications
                player.call("showNotification", [`This report is now <a style = 'color:#00b33c;'>opened<a> <i class = "fa fa-check" aria-hidden = "true"></i>`]);
            } 
            break;
        }

        //Show teleport modal
        case 3:
        {   
            //Veriffication
            if(reportedID.data.reportStaus == 'opened' && reportedID.data.reportAccesedBy != player.name)
                return player.call("showNotification", [`This report is already taken by someone.`]);
 
            player.call("showMoreModal", [1, `<button type = "button" class = "btn btn-outline-success btn-sm" onclick = "clickReport(4, ${reportedID.id});">Teleport to ${reportedID.name} <i class = "fa fa-map-marker" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-danger btn-sm" class = "close" data-dismiss = "modal" aria-label = "Close">Close <i class = "fa fa-close" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-warning btn-sm" onclick = "clickReport(4, ${playerID});">Teleport to ${reportedID.data.reportTo.name} <i class = "fa fa-map-marker" aria-hidden = "true"></i></button>`]);
            break;
        } 

        //Teleport player
        case 4:
        { 
            //Veriffication
            if(reportedID.data.reportStaus == 'opened' && reportedID.data.reportAccesedBy != player.name)
                return player.call("showNotification", [`This report is already taken by someone.`]);
 
            player.position = new mp.Vector3(reportedID.position.x, reportedID.position.y, reportedID.position.z + 1); 
            sendMessage(player, `00cc99`, `(R Teleport):!{ffffff} You teleported to ${reportedID.name}...`); 
            break;
        }

        //Close report with reason
        case 5:
        { 
            //Reset variables
            reportedID.data.haveReport = false;
            reportedID.data.reportAccesedBy = 'none';
            reportedID.data.reportStaus = 'closed';
 
            //Update CEF browser
            adminsUpdateCef(); 
   
            //Messages
            sendMessage(reportedID, COLOR_RED, `(Report):!{ffffff} Admin ${player.name} [${player.id}] respond on your report.`); 
            sendMessage(reportedID, COLOR_RED, `(Report):!{ffffff} Response: ${closeReason}.`); 

            sendAdmins(COLOR_RED, `(Report):!{ffffff} ${player.name} [${player.id}] close ${reportedID.name}'s [${reportedID.id}] report.`);
            sendAdmins(COLOR_RED, `(Report):!{ffffff} Reason: ${closeReason}.`); 
            break; 
        }
    } 
});

function loadReports(player)
{
    player.setVariable('playerMenuOpen', true);

    let textBadge = ``;
    let reportsText = ``;
    let totalReports = 0;

    mp.players.forEach(players => {

        if(players.loggedInAs == true && players.data.haveReport == true)
        { 
            let textSlice = players.data.reportDetails.slice(0, 15);
            totalReports ++;
 
            switch(players.data.reportPriority)
            { 
                case "low": textBadge = '<span class = "badge badge-pill badge-warning">low</span>'; break;
                case "medium": textBadge = '<span class = "badge badge-pill badge-success">medium</span>'; break;
                case "high": textBadge = '<span class = "badge badge-pill badge-danger">high</span>'; break;
            }
 
            reportsText += `<tr><td>${players.name}</td><td>${players.data.reportTo.name}</td><td>${players.data.reportDate}</td><td>${textSlice}...<br><a href = "#" onclick = "clickReport(1, ${players.id});">view more <i class="fa fa-caret-down" aria-hidden="true"></i></a></td><td>${textBadge}</td><td>${players.data.reportStaus == 'waiting' ? ('<span class="badge badge-pill badge-warning">in waiting</span>') : (`<span class="badge badge-pill badge-success">opened by ${players.data.reportAccesedBy}</span>`)}</td><td><button type = "button" class="btn btn-outline-info btn-sm" onclick = "clickReport(3, ${players.id});">Teleport <i class = "fa fa-map-marker" aria-hidden = "true"></i></button> ${players.data.reportStaus == 'waiting' ? (`<button type = "button" class="btn btn-outline-success btn-sm" onclick = "clickReport(2, ${players.id});">Open <i class = "fa fa-check" aria-hidden="true"></i></button>`) : (`<button type = "button" class="btn btn-outline-danger btn-sm" onclick = "clickReport(2, ${players.id});">Close <i class = "fa fa-times" aria-hidden="true"></i></button>`)}</td></tr>`;
        } 
 
        player.call("showTotalReports", [reportsText, totalReports]);
    });   
}

function adminsUpdateCef()
{
    mp.players.forEach(admins => {

        if(admins.loggedInAs == true && admins.data.admin > 0 && admins.getVariable('playerMenuOpen') == true)
        {
            loadReports(admins);  
        } 
    }); 
} 
 
//ADMIN COMMANDS - VEHICLES

mp.events.addCommand("carcolor", (player, _, veh, colorOne, colorTwo) => {
 
    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!veh || !colorOne || !colorTwo)
        return sendUsage(player, `/carcolor [vehicle_id] [color_one] [color_two]`);

    const vehicle = mp.vehicles.at(veh); 
    if(vehicle == undefined)
        return player.outputChatBox(`This vehicle doesn't exist.`);
  
    vehicle.setColor(parseInt(colorOne), parseInt(colorTwo));
     
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] change vehicle color one in ${colorOne} and color two in ${colorTwo}.`);
});

mp.events.addCommand('givecar', (player, _, id, model) => {

    if(player.data.admin < 6) 
        return player.staffPerms(6);

    if(!model || !id)
        return sendUsage(player, `/givecar [player] [vehicle_model]`);

    const user = getNameOnNameID(id);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);  
 
    give_player_vehicle(user, model, 1, player.name);

    player.call("showNotification", [`Vehicle ${model} created for ${user.name} [${user.id}]`]);
});

mp.events.addCommand("va", (player) => {

    var search_vehicles = 0;
  
    if(player.data.admin < 2) 
        return player.staffPerms(2);
     
    mp.vehicles.forEachInRange(player.position, 30, (vehicle) => {

        if(!vehicle.haveDriver)
        {
            vehicle.position = vehicle.spawn;
            vehicle.rotation = vehicle.spawnRotation;
     
            search_vehicles ++;     
        } 
    });

    if(search_vehicles) sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] respawned ${search_vehicles} vehicles (via /va).`);
});


mp.events.addCommand("dl", (player) => {

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    player.setVariable('dlActivated', !player.getVariable('dlActivated'));

    sendMessage(player, 'ff6600', `(Vehicle info):!{ffffff} Your vehicle informations is now ${(player.getVariable('dlActivated') == 1) ? ("!{09ed11}enabled") : ("!{ff4d4d}disabled!")}!{ffffff}.`);    
});

   
mp.events.addCommand("setcolor", (player, _, veh, colorone, colortwo) => {
    
    if(player.data.admin < 6) 
        return player.staffPerms(6);

    if(!veh || !colorone || !colortwo)
        return sendUsage(player, `/setcolor [vehicle] [color_one] [color_two]`);
   
    const vehicle = mp.vehicles.at(veh); 
    if(vehicle == undefined)
        return player.outputChatBox(`This vehicle doesn't exist.`);

    vehicle.setColor(colorone, colortwo);  
 
    player.call("showNotification", [`Vehicle color edited [${colorone} | ${colortwo}].`]);
});
 
mp.events.addCommand("nearcars", (player) => {

    var search_vehicles = 0;
  
    if(player.data.admin < 2) 
        return player.staffPerms(2);
    
    sendMessage(player, 'ffffff', `Search vehicle...`); 
    mp.vehicles.forEachInRange(player.position, 10, (vehicle) => {
  
        search_vehicles ++;

        sendMessage(player, 'ff6600', `>>!{ffffff} ${player.vehicleModel(vehicle)} (id: ${vehicle.id}) - created for ${player.vehicleOwner(vehicle)}.`);    
    });

    sendMessage(player, 'ffffff', `Result: ${(search_vehicles == 0 ? 'no vehicles found' : `!{ff6600}[${search_vehicles}]!{ffffff} vehicles`)} in your range.`);   
});
 

mp.events.addCommand("fv", (player) => {

    const vehicle = player.vehicle; 

    if(player.data.admin < 2) 
        return player.staffPerms(2);
 
    if(!vehicle) return;
          
    //REPAIR VEHICLE AND SET GASS
    vehicle.repair();
    vehicle.setVariable('vehicleGass', 100);

    //UPDATE SPEEDOMETER
    player.call("update_speedometer_gass", []);
      
    //NOTIFFICATION
    player.call("showNotification", [`You fixed vehicle ${vehicle.id}.`]);
});
 
mp.events.addCommand("getcar", (player, veh) => {

    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!veh) 
        return sendUsage(player, '/getcar [vehicle id]'); 

    const vehicle = mp.vehicles.at(veh); 
    if(!vehicle) 
        return player.outputChatBox(`This vehicle doesn't exist.`);
 
    vehicle.position = new mp.Vector3(player.position.x + 2.5, player.position.y, player.position.z);
    vehicle.dimension = player.dimension; 
      
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} teleported vehicle ${veh} to him (via /getcar).`);
});

mp.events.addCommand("flip", (player) => {

    const vehicle = player.vehicle; 

    if(player.data.admin < 2) 
        return player.staffPerms(2);
   
    if(!vehicle) 
        return;
 
    vehicle.rotation = new mp.Vector3(0, 0, vehicle.rotation.z);
      
    player.call("showNotification", [`You fliped vehicle ${vehicle.id}.`]);
});

mp.events.addCommand("gotocar", (player, veh) => {

    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!veh) return sendUsage(player, '/gotocar [vehicle id]'); 

    const vehicle = mp.vehicles.at(veh); 
    if(!vehicle) 
        return player.outputChatBox(`This vehicle doesn't exist.`);
 
    ((!player.vehicle) ? player.position = new mp.Vector3(vehicle.position.x + 2.5, vehicle.position.y, vehicle.position.z) : player.vehicle.position = new mp.Vector3(vehicle.position.x + 2.5, vehicle.position.y, vehicle.position.z))
    ((!player.vehicle) ? player.dimension = vehicle.dimension : vehicle.dimension = player.dimension)
     
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} teleported to vehicle ${veh.id} (via /gotocar).`);
});

mp.events.addCommand('repair', (player) => {
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!player.vehicle) 
        return player.outputChatBox("You are not in a vehicle.");

    player.vehicle.repair();
 
    sendMessage(player, '00b33c', `**Vehicle repaired successfully**`); 
});  
 
mp.events.addCommand('spawncar', (player, _, vehName) => {
  
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    
    if(!vehName) 
        return sendUsage(player, `/spawncar [vehicle_name]`);
 
    if(!player.vehicleValid(vehName))
        return sendMessage(player, 'ff3300', `ERROR:!{ffffff} This vehicle doesn't exist.`); 
 
    const admVehicle = player.createVehicle(player, vehName, player.position, generateRGB(), generateRGB(), player.heading, 1);    
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} spawned a ${vehName}.`);
});  
 
mp.events.addCommand('vre', (player, _, veh) => {
  
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    
    if((!veh || isNaN(veh)) && !player.vehicle) 
        return sendUsage(player, `/vre [vehicle_id]`);

    const vehID = mp.vehicles.at(veh); 

    if(!player.vehicle && vehID == undefined)
        return sendMessage(player, 'ff3300', `ERROR:!{ffffff} This vehicle doesn't exist.`); 
 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} destroyed a vehicle [id: ${((player.vehicle) ? player.vehicle.id : vehID.id)} (/vre)].`);
 
    //DESTROY VEHICLE
    ((player.vehicle) ? player.vehicle : vehID).destroy(); 
}); 
 
//ADMIN COMMANDS - MANAGE ADMINS/PLAYERS
mp.events.addCommand('setadmin', (player, _, id, adminLevel) => { 

    if(player.data.admin < 7) 
        return player.staffPerms(7);

    if(!id || !adminLevel) 
        return sendUsage(player, `/setadmin [player] [admin]`);

    if(adminLevel < 0 || adminLevel > 7) 
        return sendMessage(player, 'ffffff', `Maxium level is 7 and minim level is 0.`);

    const user = getNameOnNameID(id);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
  
    //MESSAGE
    user.data.admin = parseInt(adminLevel);
    sendMessage(player, COLOR_ADMIN, `(Notice):!{ffffff} You promoted ${user.name} to admin level ${user.data.admin}.`);
    sendMessage(user, COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} promoted you to admin level ${user.data.admin}.`);

    //MYSQL
    mysql_action('UPDATE `accounts` SET admin = ? WHERE username = ?', [user.data.admin, user.name]);
}); 

mp.events.addCommand('sethelper', (player, _, id, helperLevel) => { 

    if(player.data.admin < 7) 
        return player.staffPerms(7);

    if(!id || !helperLevel) 
        return sendUsage(player, `/sethelper [player] [helper]`);

    if(helperLevel < 0 || helperLevel > 3) 
        return sendMessage(player, 'ffffff', `Maxium level is 3 and minim level is 0.`);

    const user = getNameOnNameID(id);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
  
    user.data.helper = parseInt(helperLevel);
    sendMessage(player, COLOR_ADMIN, `(Notice):!{ffffff} You promoted ${user.name} to helper level ${user.data.helper}.`);
    sendMessage(user, COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} promoted you to helper level ${user.data.helper}.`);
  
    mysql_action('UPDATE `accounts` SET helper = ? WHERE username = ?', [user.data.helper, user.name]);
}); 
 
mp.events.addCommand('warn', (player, _, id, ...reason) => {   
    
    reason = reason.join(" ");
    
    if(player.data.admin < 6) 
        return player.staffPerms(6);

    if(!id || !reason || reason.length <= 0) 
        return sendUsage(player, '/warn [player] [reason]'); 

    const user = getNameOnNameID(id); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
  
    user.data.playerWarns ++;

    sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${user.name} has been warned by ${player.name} reason: ${reason} (warns: ${user.data.playerWarns}/3).`);

    mysql_action('UPDATE `accounts` SET playerWarns = ? WHERE username = ?', [user.data.playerWarns, user.name]);
});
 
mp.events.addCommand('unwarn', (player, _, id, ...reason) => {   

    reason = reason.join(" ");

    if(player.data.admin < 6) 
        return player.staffPerms(6);

    if(!id || !reason || reason.length <= 0) 
        return sendUsage(player, '/unwarn [player] [reason]'); 

    const user = getNameOnNameID(id);  
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);  

    if(user.data.playerWarns == 0)
        return sendMessage(player, 'ffffff', `This player already have 0/3 warns.`);  

    user.data.playerWarns --; 
  
    sendAdmins(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} used command (/unwarn) on ${giveplayer.name} reason: ${reason} (warns: ${giveplayer.data.playerWarns}/3).`);

    mysql_action('UPDATE `accounts` SET playerWarns = ? WHERE username = ?', [user.data.playerWarns, user.name]);
});
   
//ADMIN COMMANDS - CHAT
mp.events.addCommand('clearchat', (player) => {

    if(player.data.admin < 3)  
        return player.staffPerms(3);
    
    mp.players.forEach(_player => {
        if(_player.loggedInAs == true) 
        {
            _player.call("ClearChatBox", []);
        }
    }); 

    sendToAll('ff3300', `(( Anno: ${player.name} [${player.id}] cleared chat. ))`); 
});  
 
mp.events.addCommand('anno', (player, message) => {

    if(player.data.admin < 3)  
        return player.staffPerms(3);
    
    if(!message) 
        return sendUsage(player, '/anno [text]'); 
  
    sendToAll('ff3300', `(( Anno: ${message} ))`); 
});  

mp.events.addCommand('pm', (player, _, id, ...message) => {
    
    message = message.join(" ");

    if(player.data.admin < 1)  
        return player.staffPerms(1);

    if(!id || !message) 
        return sendUsage(player, '/pm [player] [text]'); 
    
    const user = getNameOnNameID(id);  
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
      
    sendMessage(player, 'ffff00', `(( PM sent to ${user.name}: ${message} )).`);
    sendMessage(user, '67aab1', `(( PM from ${player.name}: ${message} )).`);
});  

mp.events.addCommand('a', (player, args) => { 
    
    if(player.data.admin < 1)  
        return player.staffPerms(1);

    if(!args) 
        return sendUsage(player, `/a [text]`); 
  
    sendAdmins('ffc35a', `Admin ${player.data.admin} ${player.name}: ${args}`);
}); 
 
mp.events.addCommand('hc', (player, args) => { 

    if(player.data.admin < 1 && player.data.helper < 1) 
        return player.outputChatBox("You are not part of the staff.");

    if(player.data.helperChat == false)
        return player.call("showNotification", [`You blocked this chat (press key Q to edit).`]);
  
    sendStaff('88592b', `${player.data.admin ? 'Admin' : 'Helper'} ${player.name}: ${args}`);
}); 

mp.events.addCommand("mute", (player, _, playerID, minutes, ...reason) => {  

    if(player.data.admin < 4)  
        return player.staffPerms(4);

    if(!playerID || !minutes) 
        return sendUsage(player, '/mute [player] [minutes] [reason]'); 
 
    const user = getNameOnNameID(playerID);  
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
    
    user.data.mute = minutes * 60;

    sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} muted ${giveplayer.name} for ${minutes} ${minutes > 1 ? 'minutes' : 'minute' }. ( Reason: ${reason} )`);
 
    mysql_action('UPDATE `accounts` SET mute = ? WHERE username = ?', [user.data.mute, user.name]); 
}); 
 
mp.events.addCommand("unmute", (player, playerID) => {  

    if(player.data.admin < 4)  
        return player.staffPerms(4);

    if(!playerID) 
        return sendUsage(player, '/unmute [player]'); 
 
    const user = getNameOnNameID(playerID);  
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");

    if(user.data.mute == 0) 
        return player.outputChatBox("This player is not muted.");
      
    user.data.mute = 0;
   
    sendToAll(COLOR_GLOBAL, `(AdmBot):!{ffffff} ${player.name} unmuted ${user.name}.`);

    mysql_action('UPDATE `accounts` SET mute = ? WHERE username = ?', [0, user.name]); 
}); 
 

//ADMIN COMMANDS - GENERAL
mp.events.addCommand("setdimension", (player, _, playerID, dimension) => {  

    if(player.data.admin < 1)  
        return player.staffPerms(1);

    if(!playerID || !dimension) 
        return sendUsage(player, '/setdimension [player] [dimension]'); 
 
    const user = getNameOnNameID(playerID);  
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
 
    user.dimension = parseInt(dimension);

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] set ${user.name}'s dimenstion in ${user.dimension}.`);
}); 
 
mp.events.addCommand("spec", (player, playerID) => {  

    if(!playerID) 
        return sendUsage(player, '/spec [player]'); 
 
    const user = getNameOnNameID(playerID);  
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");


    //player.call("spectate_player", [user]);

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} [${player.id}] spectate ${user.name}.`);
}); 

mp.events.addCommand("healme", (player) => {

    if(player.data.admin < 2) 
        return player.staffPerms(2);
  
    //UPDATE VARIABLE
    player.health = 100;
    
    //UPDATE HUD
    player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]);  

    //MESSAGE
    player.call("showNotification", [`Your health is now full <i class = "fa fa-medkit"></i>`]);
});

mp.events.addCommand("heal", (player, id) => {

    if(player.data.admin < 2) 
        return player.staffPerms(2);

    if(!id)
        return sendUsage(player, '/heal [player]'); 
  
    const user = getNameOnNameID(id);
    if(user == undefined)
        return player.outputChatBox("This player is not connected.");

    //UPDATE VARIABLE
    user.health = 100;

    //UPDATE HUD
    user.call('openPlayerHud', [user.formatMoney(user.data.money, 0), user.formatMoney(user.data.moneyBank, 0), user.health, user.armour, user.data.hunger, user.data.thirst, user.data.hudStatus]);  

    //MESSAGE
    player.call("showNotification", [`You reseted ${user.name} health <i class = "fa fa-medkit"></i>`]);
    user.call("showNotification", [`${player.name} reset your health <i class = "fa fa-medkit"></i>`]);
});

mp.events.addCommand('respawn', (player, target) => {

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!target) 
        return sendUsage(player, '/respawn [player]'); 
 
    const user = getNameOnNameID(target);
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
 
    mp.events.call("spawnPlayer", user, -1); 
    
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} respawned ${user.name}.`);
    sendMessage(user, 'ff6633', `Admin ${player.name} respawned you.`);
});

mp.events.addCommand('goto', (player, playerID) => {
    
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!playerID) 
        return sendUsage(player, '/goto [player]'); 

    const user = getNameOnNameID(playerID); 
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
 
    player.position = new mp.Vector3(user.position.x + 1, user.position.y, user.position.z);
 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/goto) on ${user.name}.`);
    sendMessage(user, '669999', `${player.name} teleported to you.`);
});

mp.events.addCommand('gethere', (player, _, playerID) => {
     
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    
    if(!playerID) 
        return sendUsage(player, '/gethere [player]'); 

    const user = getNameOnNameID(playerID);
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
 
    user.position = new mp.Vector3(player.position.x + 1, player.position.y, player.position.z);

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/gethere) on ${user.name}.`);
    sendMessage(user, '669999', `${player.name} teleported you to him.`);
});

mp.events.addCommand("gotoxyz", (player, x, _, y, z) => { 
    
    if(player.data.admin < 4) 
        return player.staffPerms(4);

    if(!x || !y || !z) 
        return sendUsage(player, `/gotoxyz [x] [y] [z]`); 
     
    ((!player.vehicle) ? player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)) : player.vehicle.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)));
 
    sendMessage(player, COLOR_ADMIN, `You teleported to position: ${parseFloat(x)}, ${parseFloat(y)}, ${parseFloat(z)}`);
});

mp.events.addCommand("freeze", (player, _, playerID) => {
      
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!playerID) 
        return sendUsage(player, '/freeze [player]'); 

    const user = getNameOnNameID(playerID);
    if(user == undefined)  
        return player.outputChatBox("This player is not connected.");
     
    user.call('freezePlayer', [true]);

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/freeze) on ${user.name}.`);
});
  
mp.events.addCommand("unfreeze", (player, _, playerID) => {
      
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!playerID) 
        return sendUsage(player, '/unfreeze [player]'); 

    const user = getNameOnNameID(playerID);
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
     
    user.call('freezePlayer', [false]);
    
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/unfreeze) on ${user.name}.`);
});

mp.events.addCommand("slap", (player, _, playerID) => {
     
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!playerID) 
        return sendUsage(player, '/slap [player]'); 

    const user = getNameOnNameID(playerID);
    if(user == undefined) 
        return player.outputChatBox("This player is not connected.");
     
    user.position = new mp.Vector3(user.position.x, user.position.y, user.position.z + 2.5); 
     
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/slap) on ${user.name}.`);
});

mp.events.addCommand('disarm', (player, id) => { 

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!id) 
        return sendUsage(player, `/disarm [player]`);

    const user = getNameOnNameID(id); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);   
 
    user.removeAllWeapons();

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} Admin ${player.name} disarmed ${user.name} (/disarm).`);
}); 

mp.events.addCommand('givegun', (player, _, id, gunName, buletts) => {  

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!id || !gunName) 
        return sendUsage(player, `/givegun [id] [weapon_name] [weapon_bullets]`);
  
    const user = getNameOnNameID(id);  
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`); 
 
    user.giveWeapon(mp.joaat(gunName), parseInt(buletts)); 

    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} spawned ${gunName} with ${parseInt(buletts)} bullets for ${user.name}.`);
    sendMessage(user, 'ffffff', `${player.name} spawned ${gunName} with ${parseInt(buletts)} for you.`);
});  

mp.events.addCommand("mark", (player) => {

    if(player.data.admin < 1) 
        return player.staffPerms(1);

    player.data.markPosition = player.position;
    player.notify('You ~r~marked ~w~this position!');
});
 
mp.events.addCommand("gotomark", (player) => {
    
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    if(!player.data.markPosition) 
        return player.outputChatBox(`You don't have a marked position.`);
     
    ((!player.vehicle) ? player.position = player.data.markPosition : player.vehicle.position = player.data.markPosition); 
    player.dimension = 0;
});

//Goto Chiliad 

mp.events.addCommand('gotom', (player) => {
    
    if(player.data.admin < 1) 
        return player.staffPerms(1);

    player.position = new mp.Vector3(501.4615478515625, 5604.625, 797.9095458984375);
 
    sendAdmins(COLOR_ADMIN, `(Notice):!{ffffff} ${player.name} used command (/gotom).`);
});


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