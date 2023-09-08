require("../functions.js");
require("../auth.js");
  
const mysql = require('mysql');       

mp.events.add("playerDeath", (player, reason, killer) => {
 
    mp.events.call("spawnPlayer", player, -1);  
});

//Select spawn
mp.events.add("sendSpawnToServer", (player) => { 

    mp.events.call("spawnPlayer", player);  
});
   
mp.events.add("spawnPlayer", (player) => {
   
    player.spawn(new mp.Vector3(-1041.147, -2744.269, 21.359)); 
    player.heading = parseFloat(327.559);   
    //player.model = mp.joaat(player.data.skin);  
    player.health = 100;
  
    player.call('update_health', [player.health]); 
});
  
//Vehicle engine
mp.events.add('vehicleStartEngine', (player) => {
    if(player.vehicle && player.seat == 0 && !player.vehicleModelHaveEngine(player.vehicle.model)) { 
    
        const veh = player.vehicle;  
        const actualGass = veh.getVariable('vehicleGass');

        if(!actualGass) 
        {
            return player.call("showNotification", [`You dont have fuel in this vehicle.`]);
        }
               
        veh.engine = !veh.engine;
        player.call("setEngineState", [veh.engine, player]); 
 
        veh.setVariable('engineStatus', veh.engine);  
        player.call("showNotification", [`You ${(veh.engine == true) ? ('<a style="color:green;">started') : ('<a style="color:red;">stopped')}</a> vehicle engine.`]); 

        player.call("update_speedometer", []); 
    }
}); 
 
//Lock vehicle
mp.events.add('lockVehicle', (player) => { 


    if(player.vehicle)
    { 
        const vehicle = player.vehicle;

        //Call personalvehicle function
        mp.events.call('personalVehicleLock', player, vehicle);

        if(player.getVariable('vehicleRentedTime') > 0)
        { 
            vehicle.locked = !vehicle.locked;
            vehicle.setVariable('vehicleDoors', vehicle.locked);
                
            sendMessage(player, 'fffffff', `Your vehicle doors now ${vehicle.locked ? `!{ff4d4d}closed` : `!{09ed11}opened`}`); 
            
            player.call("update_speedometer", []); 
        } 
    }
    else 
    {
        mp.vehicles.forEach((vehicle, index) => {
        
            if(player.IsInRange(vehicle.position.x, vehicle.position.y, vehicle.position.z, 5)) 
            {    
                //Call personalvehicle function
                mp.events.call('personalVehicleLock', player, vehicle);

                if(player.getVariable('vehicleRentedTime') > 0)
                { 
                    vehicle.locked = !vehicle.locked;
                    vehicle.setVariable('vehicleDoors', vehicle.locked);
                     
                    sendMessage(player, 'fffffff', `Your vehicle doors now ${vehicle.locked ? `!{ff4d4d}closed` : `!{09ed11}opened`}`);       
                     
                    player.call("update_speedometer", []); 
                }
            }
        });    
    }   
});
 
//Put sealtbet
mp.events.add('putSeatBelt', (player) => { 

    if(player.vehicle)
    {
        player.setVariable('seatBelt', !player.getVariable('seatBelt'));
  
        player.call("showNotification", [`You ${(player.getVariable('seatBelt') == true) ? ("put") : ("remove")} your seatbelt.`]);

        player.call("update_speedometer", []); 
    } 
});
 
 
//////////////////////////////// TOGGLE MENU //////////////////////////////// 
mp.events.add('open_tog', (player) => { 

    player.call('show_tog_menu', [player.data.helperChat, player.data.groupChat]); 
});

mp.events.add('send_tog_info', (player, option, status) => { 

    //VARIABLES
    const mysql_variable = [
        ['helperChat', 'helper chat'],
        ['groupChat', 'group chat']
    ]

    //SET PLAYER VARIABLE
    switch(option)
    {
        case 0: player.data.helperChat = status; break; 
        case 1: player.data.groupChat  = status; break; 
    }
  
    //MESSAGE
    sendMessage(player, '33bbff', `(Toggle menu):!{ffffff} Your ${mysql_variable[option][1]} is now ${status == true ? ("!{00cc44}enabled") : ("!{e62e00}disabled")}!{ffffff}.`);  
 
    //MYSQL
    mysql_action(`UPDATE accounts SET ${mysql_variable[option][0]} = ? WHERE username = ?`, [status, player.name]); 
});

mp.events.add("playerDamage", (player, healthLoss, armorLoss) => {


    sendMessage(player, '33bbff', `${healthLoss}`);  

    // Do what you want.
});