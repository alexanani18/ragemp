var randomColor = require('randomcolor'); 

//Global server variable
global.gm = {}; 
gm.mysql = require('./mysql.js');
gm.auth = require('./auth.js'); 
gm.mysql.connect(function() { });

global.loaded_business_count = 0;
global.loaded_house_count = 0;
global.loaded_rent_count = 0;  
global.loaded_dealer_vehicles = 0;

global.truckerCity = [
	["Los santos"],
	["Los santos"],
	["San fierro"] 
];

global.COLOR_GLOBAL      = "ff4d4d"; 
global.COLOR_ADMIN       = "ff9900";
global.COLOR_GREEN       = "00cc66";
global.COLOR_ERROR       = "669999";  
global.COLOR_RADIO       = "0066cc";
global.COLOR_DEPARTMENT  = "ff3535";  
global.COLOR_RED         = "ff3333";

//Houses / Business   
require('./business/bizz.js')  

//Player folders
require('./player/commands.js')
require('./player/playerFunctions.js') 
                                     
//Admin folders
require('./admin/admin1.js');
require('./admin/admin2.js');
require('./admin/admin3.js');
require('./admin/admin4.js');
require('./admin/admin5.js');
require('./admin/admin6.js');
require('./admin/admin7.js');
require('./admin/reports.js');
require('./admin/need_think.js');

//DMV server
require('./dmv/index.js')   

//Voice chat
require('./voice/index.js');

//Player inventory
require("./inventory/inventory.js");
 
//Bank
require('./bank/bank.js');
 
//Others sistems
require('./others/rentCar.js');
require('./others/personalVehicles.js'); 
  
//Real wather + server time
//require('./server_time/realWather.js'); 
require("./server_time/server_time.js");

//Character creator
require('./charcreator/index.js'); 
  
mp.events.add("playerChat", (player, text) =>
{   
	if(player.data.mute > 0) 
	    return sendMessage(player, 'ffffff', `You are muted, you canno't speak.`);
     
	sendLocal(player,  `669999`, 20, `${player.name} [${player.id}]:!{ffffff} ${text}`);
});
 
mp.events.add("playerEnterVehicle", playerEnterVehicleHandler); 
function playerEnterVehicleHandler(player, vehicle, seat)
{  
	vehicle.haveDriver = true; 

	player.setVariable('seatBelt', 0);
	  
    if((player.data.drivingLicense == 0 && seat == -1) && player.data.InDMV == 0) 
    {
		player.removeFromVehicle();
		player.stopAnimation();
        sendMessage(player, 'ff4d4d', `(License):!{ffffff} You don't have driving license.`);
        return;
	}
 
	mp.events.call("callVehicleInformations", player, vehicle, seat); 
}
 
mp.events.add("playerStartEnterVehicle", playerStartEnterVehicleHandler); 
function playerStartEnterVehicleHandler(player, vehicle, seat) 
{ 
	vehicle.haveDriver = true; 

	player.setVariable('seatBelt', 0); 

    player.call("update_speedometer", []); 

    if((player.data.drivingLicense == 0 && seat == 0) && player.data.InDMV == 0) 
    {
		player.removeFromVehicle();
		player.stopAnimation();
        sendMessage(player, 'ff4d4d', `(License):!{ffffff} You don't have driving license.`);
        return;
    }
}
 
mp.events.add("playerExitVehicle", playerExitVehicleHandler); 
function playerExitVehicleHandler(player, vehicle) 
{  
	vehicle.haveDriver = false; 

	if(player.data.InDMV == 1 && player.data.schoolVehicle) 
	{ 
		player.data.schoolVehicle.destroy();
		player.call('destroyDMVCheckpoint');  
		player.call("closeDrivingCEF", [player]); 
	
		player.data.InDMV = 0; 
		player.data.dmvStage = 0;  

		sendMessage(player, 'ff4d4d', 'Instructor:!{ffffff} Examen failed because you left vehicle.');
	}
	return;
}    
  
global.generateRGB = function() {
	let color = randomColor({ luminosity: 'bright', format: 'rgb' });
	color = color.replace("rgb(", "");
	color = color.replace(")", "");
	color = color.replace(" ", "");
	color = color.split(",");
	return color;
	console.log('heard');
}

////////////////////////////////////////////////////////////////////////////  MYSQL  ////////////////////////////////////////////////////////////////////////////
global.mysql_action = function(actionOne, actionTwo)
{ 
    gm.mysql.handle.query(actionOne, actionTwo, function(err, res) { 
        if(err)  
            return console.log(err); 
    });  
} 