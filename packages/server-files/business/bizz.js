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


mp.events.addCommand('gotobiz', (player, id) => {
    
    if(!id) 
        return sendUsage(player, '/gotobiz [business id]'); 
    
    if(player.data.admin < 2) 
        return player.staffPerms(2);
    
    if(id > loaded_business_count || id < 1) 
        return sendMessage(player, '009933', 'Invalid business ID.');

    player.position = new mp.Vector3(struct.business[id - 1].bizzX, struct.business[id - 1].bizzY, struct.business[id - 1].bizzZ);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to business [${id}].`);
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
 

//------------------------------------------------------------------------------ [ CLOTHING STORE ] ------------------------------------------------------------------------------\\


let clothes_index = 0;
let clothes_drawable = 0;
let clothes_texture = 0;
let clothes_palette = 0;

mp.events.addCommand('setclothes', (player, _, arr1, arr2, arr3, arr4) => {


    clothes_index = arr1;
    clothes_drawable = arr2;
    clothes_texture = arr3;
    clothes_palette = arr4;
 
    player.setClothes(parseInt(arr1), parseInt(arr2), parseInt(arr3), parseInt(arr4)); 
});
 
mp.events.addCommand('setprop', (player, _, arr1, arr2, arr3, arr4) => {
 
    clothes_index = arr1;
    clothes_drawable = arr2;
    clothes_texture = arr3;
    clothes_palette = arr4;
 
    player.setProp(parseInt(arr1), parseInt(arr2), parseInt(arr3)); 
});
  
mp.events.addCommand("savec", (player, name = "No name") => {

    if(player.data.admin < 1) 
        return player.staffPerms(1);
    
    const saveFile = "clothes.txt"; 
    const fs = require('fs');
 
    fs.appendFile(saveFile, `Index: ${clothes_index} | Drawable: ${clothes_drawable} | Texture: ${clothes_texture} | Palette: ${clothes_palette} (gender: ${player.data.gender})\r\n`, (err) => {
        
        if (err) player.notify(`~r~SavePos Error: ~w~${err.message}`);
        else player.notify(`~g~Clothin actual saved. ~w~(${name})`);
    }); 
});
 
mp.events.add('startClothing', (player) => {
  
    for(let x = 0; x < loaded_business_count; x++)
    { 
        if(player.IsInRange(struct.business[x].bizzIntX, struct.business[x].bizzIntY, struct.business[x].bizzIntZ, 5) && struct.business[x].bizzType == 4)
        {   
            player.dimension = player.id + 1;
 
            player.position = new mp.Vector3(123.883, -219.677, 54.558);
            player.heading = 296.9725; 
            player.model = (player.data.gender == 1) ? (mp.joaat("mp_f_freemode_01")) : (mp.joaat("mp_m_freemode_01"));
             
            player.call('showPlayerClothes', [player.data.gender]); 
            break;
        }
    }     
});

mp.events.add("clicked_clothes_button", (player, option, item, money, index, drawable, color) => {  

    //CLOSE CLOTHING
    if(option == 0)
    { 
        player.dimension = 0; 
    }
            
    //BUY ITEM WITH CARD | CASH
    if(option == 2 || option == 3)
    { 
        //MESSAGE
        sendMessage(player, '0AAE59', `(Clothing):!{ffffff} You purchase a ${item} for !{ff4d4d}${player.formatMoney(money, 0)}!{ffffff}$ (with ${(option == 2) ? ("!{0AAE59}Cash") : ("!{3AAED8}Card")}!{ffffff}).`); 
 
        var item_index = 0;
        switch(index)
        {
            case 4: item_index = 'jeans';  break; //Blugii
            case 6: item_index = 'shoes'; break; //Adidasii
            case 11: item_index = 'jacket'; break; //Jackete 
            case 0: item_index = 'hat'; break; //Hat
            case 1: item_index = 'glasses'; break; //Glasses
        }

        player.data.newClothes = item_index; 
        player.data.newType = drawable;  
        player.data.newName = item;  
 
        //GIVE ITEM
        mp.events.call("givePlayerItem", player, false, drawable, 1, item, item_index, color, player.data.gender);

        setTimeout(() => {
            
            apply_clothes_items(player);

        }, 500);
    }

    //RESET ITEMS
    if(option ==  4)
    {  

        player.setClothes(4, 0, 0, 0); //Jeans
        player.setClothes(6, 0, 0, 0); //Shoes
        player.setClothes(11, 0, 0, 0); //Jacket
        player.setProp(0, 8, 0); //Hat
        player.setProp(1, 0, 0); //Glasses 
 
        reset_clothes_items(player);
    }
});

function apply_clothes_items(player)
{
    for(let x = 0; x < player.inventory.length; x++)
    {   
        if(player.inventory.length == 0)
        {
            sendMessage(player, '0AAE59', '');   
        }

        if(player.inventory[x].type < 500 && player.inventory[x].indexItem == player.data.newClothes)
        { 
            //SCOATE ITEMUL VECHI DE PE USE
            if(player.inventory[x].invUsed == true)
            {
                player.inventory[x].invUsed = false;  
                mysql_action('UPDATE `player_inventory` SET invUsed = ? WHERE id = ? LIMIT 1', [player.inventory[x].invUsed, player.inventory[x].id]);  
            } 

            //PUNE ITEMUL NOU PE USE
            if(player.inventory[x].name == player.data.newName && player.inventory[x].type == player.data.newType && player.inventory[x].indexItem == player.data.newClothes)
            {
                player.inventory[x].invUsed = true;  
                mysql_action('UPDATE `player_inventory` SET invUsed = ? WHERE id = ? LIMIT 1', [player.inventory[x].invUsed, player.inventory[x].id]);  
                break;
            }   
        }   
    }
}


function reset_clothes_items(player)
{
    for(let x = 0; x < player.inventory.length; x++)
    {  
        if(player.inventory[x].type < 500 && player.inventory[x].invUsed == true)
        {
            switch(player.inventory[x].indexItem)
            {
                case "jeans": player.setClothes(4, player.inventory[x].type, player.inventory[x].invColor, 0); break; //Jeans
                case "shoes": player.setClothes(6, player.inventory[x].type, player.inventory[x].invColor, 0); break; //Shoes
                case "jacket": player.setClothes(11, player.inventory[x].type, player.inventory[x].invColor, 0); break; //Jacket
                case "hat": player.setProp(0, player.inventory[x].type, player.inventory[x].invColor); break; //Hat
                case "glasses": player.setProp(1, player.inventory[x].type, player.inventory[x].invColor); break; //Glasses 
            }  
        }
    }
}
 
mp.events.add("clothing_apply", (player, itemIndex, itemDrawable, itemColor) => {  
 
    if(itemIndex == 0 || itemIndex == 1)
    {
        player.setProp(itemIndex, itemDrawable, itemColor);
    }
    else 
    {
        player.setClothes(itemIndex, itemDrawable, itemColor, 0); 
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