const { parse } = require('path');
var struct = require('../struct.js');  

require('../mysql.js');
require('../index.js');
 
mp.markers.new(1, new mp.Vector3(-57.110, -1096.947, 26.422 - 1.4), 1,
{
    color: [246,205,97,200],
    dimension: 0
});

mp.blips.new(225, new mp.Vector3(-57.110, -1096.947, 26.422), { 
    name: 'Premium Deluxe Motorsport', 
    color: 71, 
    shortRange: true, 
    dimension: 0 
});

mp.labels.new(`~r~Dealership~s~\nUse [~r~/buycar~s~] to buy vehicle.`, new mp.Vector3(-57.110, -1096.947, 26.322),
{
    los: true,
    font: 4,
    drawDistance: 50,
});  
  
//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_dealership_vehicles', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
 
        struct.dealership[i].dealerID = results[i].dealerID;

        struct.dealership[i].dealerModel = results[i].dealerModel;
        struct.dealership[i].dealerPrice = results[i].dealerPrice;
        struct.dealership[i].dealerStock = results[i].dealerStock;  
        struct.dealership[i].dealerSpeed = results[i].dealerSpeed;  

        loaded_dealer_vehicles ++;
    }
    
    console.log(`[MYSQL] Loaded dealership vehicles: ${loaded_dealer_vehicles.toString()}`);
});
 
mp.events.addCommand('buycar', (player) => {
  
    if(loaded_dealer_vehicles == 0) 
        return sendMessage(player, 'ffffff', "No vehicle is available in dealership.");

    if(player.data.inDealership == true)
        return;

    if(!player.IsInRange(-57.110, -1096.947, 26.422, 5)) 
        return sendMessage(player, 'FFFFFF', `You are not at Dealership.`);      

    //Set variables vehicle ID
    player.setVariable('dealerStep', 0); 
    const x = player.getVariable('dealerStep');
  
    //Set new position
    player.position = new mp.Vector3(-57.110, -1096.947, 26.422);
    player.dimension = (player.id + 1);
  
    //Player freeze
    player.call('freezePlayer', [true]);
 
    //Create dealer vehicle
    player.data.dealerVehicle = mp.vehicles.new(struct.dealership[x].dealerModel, new mp.Vector3(-37.6884, -1101.0699, 25.9983), 
    { 
        heading: 78.9433,
        dimension: player.dimension,
        color: [[0, 0, 0], [0, 0, 0]],
        locked: true,
        owner: player.name
    }); 

    player.data.inDealership = true;
  
    //Create camera
    player.call("prepareDealership", [0]);
   
    //Show CEF
    player.call("showDealershipBrowser", [player, struct.dealership[x].dealerModel, player.formatMoney(struct.dealership[x].dealerPrice, 0), struct.dealership[x].dealerStock]);  
}); 
 
mp.events.add('closeDealership', (player) => {
    
    //Resets
    player.call("prepareDealership", [1]);
    player.call('freezePlayer', [false]);
    player.dimension = 0;

    player.data.inDealership = false;
    
    //Destroy vehicle 
    player.data.dealerVehicle.destroy(); 
    player.data.dealerVehicle = null;  
});

mp.events.add('clickDealershipButtonS', (player, type, newRotation) => {

    let x = player.getVariable('dealerStep');

    switch(type)
    {
        //Close CEF
        case 0:
        {   
            mp.events.call("closeDealership", player); 
            break;
        }

        //Buy vehicle
        case 1:
        {     
            mp.events.call('givePlayerVehicle', player, player.getVariable('dealerStep'));   
            break;
        }

        //Modifi rotation
        case 2:
        {  
            const totalRotation = player.data.dealerVehicle.heading * newRotation; 
            player.data.dealerVehicle.rotation = new mp.Vector3(0, 0, totalRotation); 
            break;
        }

        default:
        {    
            //----> TYPE 1 = BACK <----// //----> TYPE 2 = NEXT <----// 
            player.setVariable('dealerStep', (type == 3) ? (player.getVariable('dealerStep') - 1) : (player.getVariable('dealerStep') + 1));
 
            if(player.getVariable('dealerStep') < 0 || player.getVariable('dealerStep') > loaded_dealer_vehicles - 1)
            {
                player.setVariable('dealerStep', (type == 3) ? (loaded_dealer_vehicles - 1) : (0));
            } 

            x = player.getVariable('dealerStep');

            //Destroy and create vehicle
            player.data.dealerVehicle.destroy(); 
            player.data.dealerVehicle = mp.vehicles.new(struct.dealership[x].dealerModel, new mp.Vector3(-37.6884, -1101.0699, 25.9983), 
            { 
                heading: 78.9433,
                dimension: player.dimension,
                color: [[0, 0, 0], [0, 0, 0]],
                locked: false,
                owner: player.name
            }); 
 
            player.call("udateDealershipBrowser", [struct.dealership[x].dealerModel, player.formatMoney(struct.dealership[x].dealerPrice, 0), struct.dealership[x].dealerStock]);   
            break;
        } 
    }  
}); 

//Function for give player vehicle
mp.events.add('givePlayerVehicle', (player, x) => {
 
    if(struct.dealership[x].dealerPrice > player.data.money) 
        return sendMessage(player, 'FFFFFF', `You don't have enough money to buy this vehicle.`);

    if(struct.dealership[x].dealerStock <= 0)
        return sendMessage(player, 'FFFFFF', `Stock epuized for this vehicle.`);

    if(player.data.totalVehicles >= player.data.totalSlots) 
        return sendMessage(player, 'FFFFFF', `You do not have a free slot (you have ${player.data.totalVehicles}/${player.data.totalSlots} vehicles).`);

    //Remove player money 
    player.giveMoney(1, struct.dealership[x].dealerPrice); 
     
    //MYSQL
    struct.dealership[x].dealerStock --;  
    mysql_action('UPDATE `server_dealership_vehicles` SET `dealerStock` = ? WHERE `dealerID` = ?', [struct.dealership[x].dealerStock, struct.dealership[x].dealerID]);
 
    //GIVE VEHICLE
    give_player_vehicle(player, struct.dealership[x].dealerModel, 0);

    //Send notiffication
    player.call("showNotification", [`You bought vehicle (<a style="color:#ff9933">${struct.dealership[x].dealerModel}</a> for <a style="color:#ff3300">${player.formatMoney(struct.dealership[x].dealerPrice, 0)}</a>)$.`]);
 
    //Update Browser
    player.call("udateDealershipBrowser", [struct.dealership[x].dealerModel, struct.dealership[x].dealerPrice, struct.dealership[x].dealerStock]);   
});
 

const dealership_spawn = [
    [-61.8462, -1116.9284, 26.0086, 2.7854],
    [-59.1075, -1116.8492, 26.0094, 2.4308], 
    [-56.3275, -1116.8088, 26.0102, 2.4939],
    [-53.5972, -1116.7734, 26.0102, 2.3383],
    [-50.6775, -1116.6683, 26.0099, 1.3789], 
    [-47.7867, -1116.5996, 26.0099, 2.8420],
    [-45.0747, -1116.4993, 26.0101, 2.7697] 
];
 
global.give_player_vehicle = function(player, model, message = 0, admin = 'none')
{ 
    const spawn = dealership_spawn[Math.floor(Math.random() * dealership_spawn.length)];

    //Insert player vehicle
    gm.mysql.handle.query('INSERT INTO `server_player_vehicles` SET vehicleModel = ?, vehicleOwner = ?, vehiclePosX = ?, vehiclePosY = ?, vehiclePosZ = ?, vehiclePosA = ?', [model, player.data.sqlid, spawn[0], spawn[1], spawn[2], spawn[3]], function(err, res) {
        if(err) 
            return console.log(err); 
    });

    //Give vehicle 
    const initialObject = {
        vehicleOwner: player.data.sqlid, 
        vehicleModel: model,

        vehicleSpawnID: -1,
        vehicleOdometer: 0,
        vehicleStatus: false,
        vehicleTimer: false,
        vehicleNumber: 'new car',
        vehicleregDate: getDates(),
 
        vehiclePosX: spawn[0],
        vehiclePosY: spawn[1],
        vehiclePosZ: spawn[2],
        vehiclePosA: spawn[3], 
        
        colorOne: 255,
        colorTwo: 255,
        colorThree: 255 
    }
 
    player.personal_vehicles.push(initialObject);     

    if(message)
        sendMessage(player, 'ff4d4d', `You received a vehicle ${model} from ${admin}.`);
}
 

 
mp.events.add('loadPlayerVehicles', (player, playerSQLID) => {

    player.personal_vehicles = [];
      
    gm.mysql.handle.query('SELECT * FROM `server_player_vehicles` WHERE `vehicleOwner` = ?', [playerSQLID], function(error, results) {

        if(error) return sendMessage(player, 'ff4d4d', `[ERROR]:!{ffffff} Your vehicles have not been loaded.`);

        if(results.length > 0) 
        { 
            var localVehs = 0;

            for(var carData = 0; carData < results.length; carData ++)
            { 
                player.personal_vehicles[localVehs] = results[carData];  

                player.personal_vehicles[localVehs].vehicleSpawnID = -1;
                player.personal_vehicles[localVehs].vehicleTimer = false;

                localVehs ++; 
            } 
        }  
    }); 
});

mp.events.addCommand("eject", (player, id) => {
    
    
    if(!player.vehicle)  
        return player.outputChatBox("This command can be used only inside a vehicle.");
     
    if(player.seat != 0) 
        return player.outputChatBox("Only the driver of a vehicle can use this command.");

    if(!id)
        return sendUsage(player, `/eject [player]`);
    
    const user = getNameOnNameID(id); 
    if(user == undefined) 
        return sendMessage(player, 'ffffff', `Player not found.`);  
 
    if(user == player) 
        return player.outputChatBox(`You're not supposed to use this command on yourself.`);
    
    if(user.vehicle != player.vehicle) 
        return player.outputChatBox("This player is not inside your vehicle.");
    
    user.call('playerLeaveVehicle');

    sendLocal(player, 'c2a2da', 20, `${user.name} [${user.id}] was thrown out of vehicle by ${player.name} [${player.id}].`); 
});
 
mp.events.addCommand('v', (player) => {
 
    if(!player.personal_vehicles.length) return sendMessage(player, 'FFFFFF', `You don't have a personal vehicle.`);
  
    updateCefVeh(player); 
});
  
function updateCefVeh(player)
{
    player.setVariable('inMenuVehicle', true);

    let teeeext = ''; 
    for(let i = 0; i < player.personal_vehicles.length; i++)
    {   
        teeeext += `<h6 class = "item"><div>${player.personal_vehicles[i].vehicleModel} - ${player.personal_vehicles[i].vehicleSpawnID == -1 ? ('<span class = "badge badge-pill badge-danger"><i class="fa fa-times" aria-hidden="true"></i> not spawned</span>') : (`<span class="badge badge-pill badge-success"><i class="fa fa-check" aria-hidden="true"></i> spawned (ID: ${player.personal_vehicles[i].vehicleSpawnID.id})</span>`)}<span class="float-right">${player.personal_vehicles[i].vehicleSpawnID == -1 ? (`<button type = "button" class = "btn btn-outline-success btn-sm" onclick = "sendPVehicleInfo(1, ${i});">Spawn <i class="fa fa-check" aria-hidden="true"></i></button>`) : (`<button type = "button" class = "btn btn-outline-danger btn-sm" onclick = "sendPVehicleInfo(1, ${i});">Despawn <i class="fa fa-times" aria-hidden="true"></i></button>`)} <button type = "button" class = "btn btn-outline-info btn-sm" onclick = "sendPVehicleInfo(0, ${i});">More <i class="fa fa-bars" aria-hidden="true"></i></button></span></div></h6>`;
    }                                                                                                                                                                                                                                                           
 
    player.call("showPlayerVehicles", [teeeext]);  
}
  
mp.events.add('clickPersonalVehicleButton', (player, button, x) => {

    switch(button)
    {
        //Close browser
        case -1: 
        {
            player.setVariable('inMenuVehicle', false);
            break;
        }

        //Show more
        case 0:
        { 
            player.call('showPlayerMore', [x, player.personal_vehicles[x].vehicleSpawnID, player.personal_vehicles[x].vehicleModel, player.formatMoney(player.personal_vehicles[x].vehicleOdometer, 0), player.personal_vehicles[x].vehicleNumber, player.personal_vehicles[x].vehicleregDate]);
            break;
        }
 
        /*-----------------------Spawn/Despawn/Find-----------------------*/ 
        //Spawn/Despawn vehicle
        case 1: 
        { 
            if(player.personal_vehicles[x].vehicleSpawnID == -1)
            {   
                if(player.personal_vehicles[x].vehicleTimer != false)
                    return player.call("showNotification", [`This vehicle is allready in spawn progress.`]);
 
                //Remove money
                const money = player.data.level * (500 + Math.random() * 6).toFixed(0); 
                player.giveMoney(1, money);

                //Send notiffication
                player.call("showNotification", [`You payd <a style="color:#ff4d4d">${player.formatMoney(money, 0)}<a>$ vehicle will be spawned in 20 seconds.`]);

  
                //Set timeout spawn vehicle
                player.personal_vehicles[x].vehicleTimer = setTimeout(() => {
  
                    //Delete vehicle timer
                    player.personal_vehicles[x].vehicleTimer = false;

                    //Create vehicle 
                    player.personal_vehicles[x].vehicleSpawnID = mp.vehicles.new(player.personal_vehicles[x].vehicleModel, new mp.Vector3(player.personal_vehicles[x].vehiclePosX, player.personal_vehicles[x].vehiclePosY, player.personal_vehicles[x].vehiclePosZ),
                    {   
                        color: [[player.personal_vehicles[x].colorOne, player.personal_vehicles[x].colorTwo, player.personal_vehicles[x].colorThree], [player.personal_vehicles[x].colorOne, player.personal_vehicles[x].colorTwo, player.personal_vehicles[x].colorThree]],
                        locked: player.personal_vehicles[x].vehicleStatus,  
                        engine: false,
                        dimension: player.dimension,
                        owner: player.name,
                        heading: player.personal_vehicles[x].vehiclePosA
                    });    
                    player.personal_vehicles[x].vehicleSpawnID.setVariable('vehicleGass', 100);

                    //UPDATE VEHICLE COLOR IN DATABASE
                    mysql_action('UPDATE `server_player_vehicles` SET `colorOne` = ?, `colorTwo` = ?, `colorThree` = ? WHERE `vehicleID` = ? LIMIT 1', [player.personal_vehicles[x].colorOne, player.personal_vehicles[x].colorTwo, player.personal_vehicles[x].colorThree, player.personal_vehicles[x].vehicleID]);
                
                    //Update CEF for player
                    if(player.getVariable('inMenuVehicle') == true) 
                    {
                        updateCefVeh(player);
                        player.call('showPlayerMore', [x, player.personal_vehicles[x].vehicleSpawnID, player.personal_vehicles[x].vehicleModel, player.personal_vehicles[x].vehicleOdometer, player.personal_vehicles[x].vehicleNumber, player.personal_vehicles[x].vehicleregDate]);
                    }

                }, 2000);  
            } 
            else 
            { 
                if(player.personal_vehicles[x].vehicleTimer == true)
                    return player.call("showNotification", [`This vehicle is is spawn progress, wait.`]);

                if(player.personal_vehicles[x].vehicleSpawnID == -1)
                    return player.call("showNotification", [`This vehicle is not spawned.`]);
 
                //Send notiffication
                player.call("showNotification", [`You despawned vehicle ${player.personal_vehicles[x].vehicleModel} [${player.personal_vehicles[x].vehicleSpawnID.id}]`]); 
  
                //Destroy vehicle 
                if(player.personal_vehicles[x].vehicleSpawnID != -1)
                {
                    player.personal_vehicles[x].vehicleSpawnID.destroy();
                    player.personal_vehicles[x].vehicleSpawnID = -1; 
                }

                //Update CEF for player
                if(player.getVariable('inMenuVehicle') == true) 
                {
                    updateCefVeh(player); 
                    player.call('showPlayerMore', [x, player.personal_vehicles[x].vehicleSpawnID, player.personal_vehicles[x].vehicleModel, player.personal_vehicles[x].vehicleOdometer, player.personal_vehicles[x].vehicleNumber, player.personal_vehicles[x].vehicleregDate]);
                }
            } 
            break;
        }

        //Find vehicle
        case 2:
        { 
            //Veriffication
            if(player.personal_vehicles[x].vehicleSpawnID == -1)
                return player.call("showNotification", [`This vehicle is not spawned.`]);
 
            //Send notiffications
            player.call("showNotification", [`Vehicle ${player.personal_vehicles[x].vehicleModel} [${player.personal_vehicles[x].vehicleSpawnID.id}] was located.`]);
 
            //Set player checkpoint
            player.call('setPlayerCheckPoint', [player, player.personal_vehicles[x].vehiclePosX, player.personal_vehicles[x].vehiclePosY, player.personal_vehicles[x].vehiclePosZ]);  
            break;
        }  
    }  
});  

mp.events.add('editVehicleColor_execute', (player, x, colorOne, colorTwo, colorThree) => {
 
    player.personal_vehicles[x].colorOne = colorOne;
    player.personal_vehicles[x].colorTwo = colorTwo;
    player.personal_vehicles[x].colorThree = colorThree; 
});

mp.events.add('callVehicleInformations', (player, vehicle, seat) => { 
 
    mp.players.forEach(x => {
        if(x.loggedInAs == true)
        {
            for(let i = 0; i < x.personal_vehicles.length; i++)
            { 
                if(x.personal_vehicles[i].vehicleSpawnID.id == vehicle.id)
                {
                    sendMessage(player, '8080ff', `(Personal car):!{ffffff} This ${x.personal_vehicles[i].vehicleModel} [!{8080ff}${x.personal_vehicles[i].vehicleSpawnID.id}!{ffffff}] is owned by ${x.name}, !{8080ff}${player.formatMoney(player.personal_vehicles[i].vehicleOdometer, 0)}!{ffffff} km traveled.`);
                     
                    player.call("update_speedometer_km", [parseFloat(x.personal_vehicles[i].vehicleOdometer)]);
                    break;
                }  
            } 
        }
    });
    return;
});   

//Lock/unlock vehicle
mp.events.add("personalVehicleLock", (player, vehicle) => { 
 
    mp.players.forEach(x => {
        if(x.loggedInAs == true)
        {
            for(let i = 0; i < x.personal_vehicles.length; i++)
            { 
                if(x.personal_vehicles[i].vehicleSpawnID.id == vehicle.id)
                { 
                    player.personal_vehicles[i].vehicleStatus = !player.personal_vehicles[i].vehicleStatus; 
                    vehicle.locked = !vehicle.locked; 
                    vehicle.setVariable('vehicleDoors', vehicle.locked);
  
                    //Update SQL 
                    mysql_action('UPDATE `server_player_vehicles` SET `vehicleStatus` = ? WHERE `vehicleID` = ? LIMIT 1', [vehicle.locked, player.personal_vehicles[i].vehicleID]); 

                    player.call("showNotification", [`This ${x.personal_vehicles[i].vehicleModel} [<a style="color:#8080ff">${x.personal_vehicles[i].vehicleSpawnID.id}<a>] is now ${(vehicle.locked == true) ? ('<a style="color:#ff4d4d;">locked<a> <i class="fa fa-lock" aria-hidden="true"></i>') : ('<a style="color:#09ed11;">opened<a> <i class="fa fa-unlock" aria-hidden="true"></i>')}`]); 

                    player.call("update_speedometer", []); 
                    break;
                }  
            } 
        }
    });
});
  
//All vehicles 
setInterval(() => {

    //Foreach vehicle
    mp.players.forEach((players) => 
    {
        if(players.vehicle && !players.vehicleModelHaveEngine(players.vehicle.model)) 
        { 
            player.vehicle.engine = false;
            const vehicle = players.vehicle; 
            const actualGass = vehicle.getVariable('vehicleGass');

            if(actualGass > 0 && vehicle.getVariable('engineStatus') == true)
            {
                player.vehicle.engine = false;
                vehicle.setVariable('vehicleGass', actualGass - 1); 

                players.call("update_speedometer_gass", []);

                if(vehicle.getVariable('vehicleGass') <= 0)
                {  
                    players.call('setEngineState', [!vehicle.engine, players]); 
                    vehicle.engine = !vehicle.engine; 
                }
            } 
        }
    }); 
}, 5000); 
  
global.update_vehicle_odometer = function(player)
{
    //Foreach vehicle 
    if(player.loggedInAs == true)
    {
        for(let i = 0; i < player.personal_vehicles.length; i++)
        { 
            if(player.personal_vehicles[i].vehicleSpawnID != -1)
            { 
                player.personal_vehicles[i].vehicleOdometer ++;
 
                player.call("update_speedometer_km", [parseFloat(player.personal_vehicles[i].vehicleOdometer)]);
                    
                mysql_action('UPDATE `server_player_vehicles` SET `vehicleOdometer` = ? WHERE `vehicleID` = ? LIMIT 1', [player.personal_vehicles[i].vehicleOdometer, player.personal_vehicles[i].vehicleID]); 
                break;
            }  
        } 
    } 
} 
 