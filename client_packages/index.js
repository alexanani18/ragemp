var gps_blip = null;
var gps_checkpoint = null; 
var frozenPlayer = false;  
var blip_orange = null; 

//Noclip
require('./noclip');  
 
//Login & Register
require("CEF/serverLoginReg/index.js");  

//Rent car
require("CEF/rentCar/rentCar.js");    
  
//Scale
require('scaleform_messages/index.js')

//Voice chat
require("CEF/voiceChat/index.js"); 
  
//Driving school 
require("CEF/driving-school/index.js");

//Notiffications
require("CEF/notifications/notifications.js");

//Progress bar
require("CEF/progressBar/progress.js");
 
//Bank Sistem
require("CEF/bankSistem/bank.js");

//Personal vehicles
require("CEF/personalVehicles/personalVehicles.js");

//Reports sistem
require("CEF/reportsSistem/reports.js");

//Inventory
require("CEF/inventory/inventory.js");
 
//Hud
require("CEF/hud/hud.js");

//Entity selector
require("CEF/entity_selector/index.js");

//Shop
require("CEF/shop/shop.js");
 
//Character-creator
require("CEF/characterCreator/character.js");

//SERVER BUSINESS       
require("CEF/business/gasStation/gasStation.js"); //- Gas station
require("CEF/business/store24/store24.js"); //- 24/7 store 
require("CEF/business/gunShop/gunShop.js"); //- Gun shop
 
//Chat 
require('newChat/index.js');
 
//Helping 
require('CEF/helping/admin_help/index.js');

//Tog menu 
require('CEF/toggle/index.js');
 
//Spedometer
require("CEF/speedometer/script.js");

//Phone
require("CEF/phone/index.js");
  
//Player checkpoints sistem 
mp.events.add('setPlayerCheckPoint', (player, x, y, z, finding = null) => { 
       
    gps_blip = mp.blips.new(1, new mp.Vector3(x, y, z),
    {
        name: 'GPS Location', scale: 1, color: 83, alpha: 255, shortRange: false, dimension: player.dimension,
    }); 
    gps_blip.setRoute(true); 

    gps_checkpoint = mp.checkpoints.new(4, new mp.Vector3(x, y, z - 1.0), 4,
    {
        direction: new mp.Vector3(0, 0, 75),
        color: [ 255, 0, 255, 100 ],
        visible: true,
        dimension: player.dimension
    });
 
    if(finding != null)
    {
        const getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0); 

        mp.gui.chat.push(`!{3399ff}(Find):!{ffffff} ${finding} localized successfully (Street name: ${mp.game.ui.getStreetNameFromHashKey(getStreet.streetName)}).`);
    }   
});
 
mp.events.add('set_find_checkpoint', (player, distance, x, y, z, finding = null) => { 

    if(gps_checkpoint == null)
    {
        //Create checkpoint
        gps_checkpoint = mp.checkpoints.new(4, new mp.Vector3(x, y, z - 1.0), 2, { direction: new mp.Vector3(0, 0, 75), color: [ 255, 0, 255, 100 ], visible: true, dimension: player.dimension });
 
        if(finding != null && gps_checkpoint == null)
        {
            const getStreet = mp.game.pathfind.getStreetNameAtCoord(x, y, z, 0, 0); 
    
            mp.gui.chat.push(`!{3399ff}(Find):!{ffffff} ${finding} localized successfully (Street name: ${mp.game.ui.getStreetNameFromHashKey(getStreet.streetName)}).`);
        }    
    }
    else 
    { 
        gps_checkpoint.position = new mp.Vector3(x, y, z - 1.0);  
    } 
 
    mp.events.call("one_find_hud", `<strong>Player: ${finding}<br>Distance: <a style="color: #ff6600;">${(distance).toFixed(3)}M</a></strong>`); 
});

mp.events.add("destroy_checkpoint", () => {
    if(gps_checkpoint != null) 
    {  
        //Destroy Blip
        gps_checkpoint.destroy();
        gps_checkpoint = null;
    } 
}); 
  
mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if(gps_blip != null && checkpoint == gps_checkpoint) 
    {  
        //Destroy Blip
        gps_blip.setRoute(false);
        gps_blip.destroy();
        gps_checkpoint.destroy();
        gps_checkpoint = null;
        gps_blip = null; 
    } 
}); 

//Create marker job (orange)
mp.events.add('createMarkerOrange', (x, y, z, number) => {
 
    if(blip_orange != null)
    {
        blip_orange.destroy();
        blip_orange = null;
    }

    blip_orange = mp.markers.new(1, new mp.Vector3(x, y, z), number,
    {
        color: [255, 165, 0, 50],
        dimension: 0,
    });  
});
 
//Engine
mp.events.add('setEngineState', (status, player) => {
  
    if(status == true)
    {
        player.vehicle.setLights(0);

        mp.gui.chat.push('dezactivated');
    }

    if(player.vehicle && !player.vehicle.getIsEngineRunning()) 
    {
	    player.vehicle.setEngineOn(status, status, true);
        player.vehicle.setUndriveable(status);   
	}
});

//Freeze player
mp.events.add('freezePlayer', (toggle) => {
    frozenPlayer = toggle;
});  
 
//---------------------------------------------------------------------------------------- [ KEY BINDS ] --------------------------------------------------------------------------------------\\

//House
mp.keys.bind(0x46, true, function() {
 
	if(isChatActive() == false) mp.events.callRemote("commandEnterLeaveHouse");	
}); 

mp.keys.bind(0x48, true, function() {
 
	if(isChatActive() == false) mp.events.callRemote("interractHouse");	
}); 
  
mp.keys.bind(0x32, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("vehicleStartEngine");	 
}); 

mp.keys.bind(0x4E, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("lockVehicle");	 
});  
 
mp.keys.bind(0x42, true, function() {
  
    if(isChatActive() == false) mp.events.callRemote("putSeatBelt");	 
});  
  
//Functions
function Calculate(secundeRamase)
{
    var minutes = Math.floor(secundeRamase / 60);
    var seconds = secundeRamase - (minutes * 60);

    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds;
}
   
mp.events.add('playDrillScenario', (scenarioName) => {

    mp.players.local.taskStartScenarioInPlace(scenarioName, 0, false);
}); 
 
var vehicle_stream = [];
var lastHealth = 0; 

mp.events.add('render', () => { 
    const player = mp.players.local;

    //REMOVE HUD
    mp.game.player.setHealthRechargeMultiplier(0.0);
    mp.game.ui.hideHudComponentThisFrame(6);
    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(8);
    mp.game.ui.hideHudComponentThisFrame(4);
    mp.game.ui.hideHudComponentThisFrame(9);
    mp.game.ui.hideHudComponentThisFrame(22);
    mp.game.ui.hideHudComponentThisFrame(20);
    mp.game.ui.hideHudComponentThisFrame(3);
    mp.game.ui.hideHudComponentThisFrame(2);

    //LOGO SERVER
    mp.game.graphics.drawText("sCr mode", [0.93, 0.97], {font: 7, color: [255, 255, 255, 255], scale: [0.5, 0.5], outline: true});
  
    //FREEZE SISTEM
    if(frozenPlayer == true) 
    {
        mp.game.controls.disableAllControlActions(0);
    }

    //HEALTH SISTEM 
    var healthLoss = 0;

    if(lastHealth != player.getHealth()) {
        healthLoss = lastHealth - player.getHealth();
        lastHealth = player.getHealth();
    }
    if(healthLoss > 0) 
    {
        mp.events.call("update_health", player.getHealth()); 
    }
 

    //DL SISTEM
    mp.vehicles.forEachInRange(player.position, 10, (vehicle) => {

        if(player.getVariable('dlActivated') == 1)
        {
            if(!vehicle_stream[vehicle.id])
            {   
                vehicle_stream[vehicle.id] = mp.labels.new(`~b~[id: ${vehicle.id} | model: ${vehicle.getVariable('vehicleName')} | health: ${vehicle.getEngineHealth().toFixed(3)}]\nPos: ${(vehicle.position.x).toFixed(3)}, ${(vehicle.position.y).toFixed(3)}, ${(vehicle.position.z).toFixed(3)}`, new mp.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z),
                {
                    los: false,
                    font: 4,
                    drawDistance: 10,
                    dimension: player.dimension
                });   
            }
    
            else 
            {
                if(player.dimension == vehicle_stream[vehicle.id].dimension)
                {
                    vehicle_stream[vehicle.id].position = vehicle.position;
                    vehicle_stream[vehicle.id].text = `~b~[id: ${vehicle.id} | model: ${vehicle.getVariable('vehicleName')} | health: ${vehicle.getEngineHealth().toFixed(3)}]\nPos: ${(vehicle.position.x).toFixed(3)}, ${(vehicle.position.y).toFixed(3)}, ${(vehicle.position.z).toFixed(3)}`;
                } 
            } 
        }  
        else 
        {
            if(vehicle_stream[vehicle.id])
            {
                vehicle_stream[vehicle.id].text = '';
                vehicle_stream[vehicle.id].dimension = -1; 
            } 
        }
	});

 
    //mp.discord.update('Playing on mihaiadv project', `Players: `);   
}); 


////////////////////////////////////////////////// OBJECTS AND LABELS //////////////////////////////////////////////////
 
var label_struct = [];
var object_struct = [];

//Create label  
mp.events.add("createLabel", (x, labelText, labelPositionX, labelPositionY, labelPositionZ) => {
      
	label_struct[x] = mp.labels.new(labelText, new mp.Vector3(labelPositionX, labelPositionY, labelPositionZ),
	{
		los: false,
		font: 4,
		drawDistance: 50,
		dimension: 0
    });  
}); 

//Update label text
mp.events.add("updateLabel", (x, labelText) => {
 
	label_struct[x].text = labelText;
}); 

mp.events.add("destroyLabel", (x) => {
        
    if(label_struct[x])
    {
        label_struct[x].destroy();
        label_struct[x] = false; 
    } 
}); 
  
mp.events.add("create_object", (x, model, posX, y, z) => {
      
	object_struct[x] = mp.game.object.createObject(model, posX, y, z, true, true, true); 
}); 

mp.events.add("update_object", (x, posX, posY, posZ) => {
    if(object_struct[x])
    {  

        mp.gui.chat.push(`Z: ${object_struct[x].position.z}`)
 
        object_struct[x].z = object_struct[x].z + 0.20;
    }
}); 

mp.events.add("destroy_object", (x) => {
      
    if(object_struct[x])
    { 
        mp.game.object.deleteObject(object_struct[x]);
        object_struct[x] = false; 
    } 
}); 
 
//VEHICLE EJECT
mp.events.add('playerLeaveVehicle', () => {
    
    const player = mp.players.local;

    if(player.vehicle) 
    {
	    player.taskLeaveVehicle(player.vehicle.handle, 0);
	}
});

//Spectating player
mp.events.add("spectate_player", (userID) => {
 
    const user = mp.players.local;
    const playerPosition = user.position

    if(user == userID)
    {
        mp.gui.chat.push(`debug 1`); 

        let handCamera = mp.cameras.new('default', new mp.Vector3(0,  0,  0), new mp.Vector3(0,0,0), 40);
 
        handCamera.setActive(true);
        handCamera.attachToPedBone(mp.players.local.handle, 57005, 0, 0, 0, true);
        handCamera.setCoord(playerPosition.x + 1, playerPosition.y + 1, playerPosition.z);
        mp.game.cam.renderScriptCams(true, false, 0, true, false); 
    } 
});    
 


mp.events.add("play_facial_anim", (player, dict, name) => {
 
    mp.gui.chat.push(`debug 1`); 

    mp.players.local.playFacialAnim(dict, name);
});    

  