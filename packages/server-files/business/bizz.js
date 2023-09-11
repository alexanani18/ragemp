var struct = require('../struct.js'); 
require('../mysql.js');
require('../index.js');
 
//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_business', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
		  
		struct.business[i].bizzOwner = results[i].businessOwner;
        struct.business[i].bizzID = i + 1;
        
        struct.business[i].bizzPrice = results[i].businessPrice; 
        struct.business[i].bizzFee = results[i].businessFee; 
        struct.business[i].bizzBalance = results[i].businessBalance; 

        struct.business[i].bizzIcon = results[i].businessIcon; 
        struct.business[i].bizzType = results[i].businessType;
        struct.business[i].bizzDescription = results[i].businessDescription;

        //exterior pos
		struct.business[i].bizzX = results[i].exitX;
		struct.business[i].bizzY = results[i].exitY;
        struct.business[i].bizzZ = results[i].exitZ;
        
        //int pos
		struct.business[i].bizzIntX = results[i].entX;
		struct.business[i].bizzIntY = results[i].entY;
        struct.business[i].bizzIntZ = results[i].entZ;
            
        //Label exterior
		struct.business[i].bizz3DText = mp.labels.new(`~r~Business:~s~ ${i + 1}${struct.business[i].bizzDescription == "no description" ? "" : `\n~r~Description:~s~ ${struct.business[i].bizzDescription}`}\n~r~Owner:~s~ ${struct.business[i].bizzOwner}\n${struct.business[i].bizzPrice > 0 ? "~r~For sale (use /buybusiness)" : ""}`, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ)),
		{
			los: true,
			font: 4,
			drawDistance: 10,
        });  
  
        //Label interior

        if(struct.business[i].bizzType != 1)
        {
            struct.business[i].bizz3DTextInterior = mp.labels.new(`~r~Business:~s~ ${i + 1}\nPress ~b~E~s~ to open menu`, new mp.Vector3(parseFloat(results[i].entX), parseFloat(results[i].entY), parseFloat(results[i].entZ)),
            {
                los: true,
                font: 4,
                drawDistance: 10,
            }); 
        }
 
		struct.business[i].bizzPickup = mp.markers.new(1, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ - 1.1)), 1,
		{
		    direction: new mp.Vector3(0, 0, 0),
		    rotation: new mp.Vector3(0, 0, 0),
		    visible: true,
		    dimension: 0
        });   

        struct.business[i].bizzBlip = mp.blips.new(struct.business[i].bizzIcon, new mp.Vector3(parseFloat(results[i].exitX), parseFloat(results[i].exitY), parseFloat(results[i].exitZ - 1.1)), {
            name: `${struct.business[i].bizzPrice > 0 || struct.business[i].bizzOwner == "AdmBot" ? "~r~For sale (use /buybusiness)" : `Owner: ${struct.business[i].bizzOwner}`}`,
            scale: 0.8,
            color: 25,
            drawDistance: 5,
            shortRange: true,
            dimension: 0,
        });

        loaded_business_count ++;
    }
    
    console.log(`[MYSQL] Loaded business: ${loaded_business_count.toString()}`);
});


//------------------------------------------------------------------------------ [ 24/7 STORE ] ------------------------------------------------------------------------------\\


mp.events.add("accesingStore", (player, option, product, price, type, itemID) => { 

    switch(option)
    {
        case 0: break; //Close store
        case 1: //Show Store
        {    
            for(let x = 0; x < loaded_business_count; x++)
            { 
                if(player.IsInRange(struct.business[x].bizzIntX, struct.business[x].bizzIntY, struct.business[x].bizzIntZ, 5) && struct.business[x].bizzType == 2)
                {  
                    player.call('showPlayerStore', [player]);   
                    break;
                }
            }   
            break;
        } 
 
        case 2:
        {  
            if((player.data.money < price && type == 0) || (player.data.moneyBank < price && type == 1))
                return player.call("showNotification", ["You don`t have this money."]);
  
            (type == 0) ? (player.giveMoney(1, price)) : (player.give_money_bank(1, price))
 
            //GIVE ITEM
            mp.events.call("givePlayerItem", player, true, itemID, 1, product, -1, 0, -1); 
 
            sendMessage(player, '0AAE59', `(24/7 Store):!{ffffff} You purchase a ${product} for !{ff4d4d}${player.formatMoney(price, 0)}!{ffffff}$ (with ${(type == 0) ? ("!{0AAE59}Cash") : ("!{3AAED8}Card")}!{ffffff}).`);
            sendMessage(player, '0AAE59', `(24/7 Store):!{ffffff} For view this press key [!{ff4d4d}Y!{ffffff}].`); 
            break;
        }
    } 
});   


//------------------------------------------------------------------------------ [ GUN SHOP ] ------------------------------------------------------------------------------\\


mp.events.add("accesingGunShop", (player, option, gunName, gunPrice, gunBullets, type) => { 

    switch(option)
    {
        case 0: break; //Close Gun Shop
        case 1: //Show Gun Shop
        {    
            for(let x = 0; x < loaded_business_count; x++)
            { 
                if(player.IsInRange(struct.business[x].bizzIntX, struct.business[x].bizzIntY, struct.business[x].bizzIntZ, 5) && struct.business[x].bizzType == 3)
                {  
                    player.call('showPlayerGuns', [player]);   
                    break;
                }
            }    
            break;  
        } 

        //Buy weapon
        case 2:
        { 
            if((player.data.money < gunPrice && type == 0) || (player.data.moneyBank < gunPrice && type == 1))
                return player.call("showNotification", ["You don`t have this money."]);
 
            var weaponName = "weapon_pistol";

            switch(gunName) 
            {
                case "Pistol": weaponName = "weapon_pistol"; break;
                case "Micro SMG": weaponName = "weapon_microsmg"; break;
                case "Assault Rifle": weaponName = "weapon_assaultrifle"; break;
                case "Heavy Sniper": weaponName = "weapon_heavysniper"; break;
            } 

            //Send message
            sendMessage(player, '0AAE59', `(Gun Shop):!{ffffff} You purchase a ${gunName} (${gunBullets} bullets) for !{ff4d4d}${player.formatMoney(gunPrice, 0)}!{ffffff}$ (with ${(type == 1) ? ("!{0AAE59}Cash") : ("!{3AAED8}Card")}!{ffffff}).`);
 
            //Give weapon
            player.giveWeapon(mp.joaat(weaponName), parseInt(gunBullets));

            //Remove money    
            (type == 0) ? (player.giveMoney(1, gunPrice)) : (player.give_money_bank(1, gunPrice))
            break;
        }
    } 
});   

//------------------------------------------------------------------------------ [ GAS STATION ] ------------------------------------------------------------------------------\\

const pomp_position = [ 
    [173.6375, -1567.1781, 29.2893],  
    [180.5938, -1560.8322, 29.2575],
    [170.3333, -1563.0900, 29.2709], 
    [177.0260, -1556.8339, 29.2308],  
    [174.9245, -1554.9385, 29.2201],   
    [168.0598, -1561.1866, 29.2596]  
];
 
for(let x = 0; x < pomp_position.length; x ++) 
{ 
    mp.markers.new(3, new mp.Vector3(pomp_position[x][0], pomp_position[x][1], pomp_position[x][2]), 1,
    {
        direction: new mp.Vector3(0, 0, 0),
        rotation: new mp.Vector3(0, 0, 0),
        visible: true,
        dimension: 0
    });  
    
    mp.labels.new(`Station: ~r~${x + 1}~s~\nUse ~b~E~s~ to interract`, new mp.Vector3(pomp_position[x][0], pomp_position[x][1], pomp_position[x][2]),
	{
		los: false,
		font: 4,
		drawDistance: 50,
		dimension: 0
    });  
}
 
mp.events.add("start_gass_fill", (player, price, payOption) => { 

    if((player.data.money < price && payOption == 0) || (player.data.moneyBank < price && payOption == 1))
        return player.call("showNotification", ["You don`t have this money."]);


    player.call("start_fill_final", [payOption]);   
});
 
mp.events.add("accesingGasBrowser", (player, option, price, liters, payOption) => { 

    switch(option)
    {
        case 0: break;
        case 1: 
        {    
            player.call("closeBrowserGas", [0]);   

            //Put gas in vehicle
            const vehicle = player.vehicle;

            const actualGass = vehicle.getVariable('vehicleGass');
            var liters2 = 0;

            if(actualGass + parseInt(liters) >= 100) liters2 = 100;
            else liters2 = actualGass + parseInt(liters);

            vehicle.setVariable('vehicleGass', liters2);

            player.call("update_speedometer_gass", []);
     
            //Remove money    
            (payOption == 0) ? (player.giveMoney(1, price)) : (player.give_money_bank(1, price))

            sendMessage(player, '009900', `(Gas - Station):!{ffffff} You filled your vehicle with ${liters} liters (total: ${liters2}) for !{ff4d4d}${player.formatMoney(price, 0)}!{ffffff}$ (with ${(payOption == 0) ? ("!{0AAE59}Cash") : ("!{3AAED8}Card")}!{ffffff}).`);  
            break; 
        }
        default:
        { 
            for(let x = 0; x < pomp_position.length; x ++)
            { 
                if(player.IsInRange(pomp_position[x][0], pomp_position[x][1], pomp_position[x][2], 2))
                { 
                    if(!player.vehicle)
                        return player.call("showNotification", ['You need to be in vehicle for fill this.']);
          
                    player.call('showPlayerGasStation', []);  
                    break;   
                }
            }   
        }
    } 
}); 