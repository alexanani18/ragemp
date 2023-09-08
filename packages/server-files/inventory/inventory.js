//Requires
var struct = require('../struct.js'); 

require('../mysql.js');
require('../index.js');

//Load inventory items
mp.events.add('loadPlayerInventory', (player, playerSQLID) => {
 
	player.inventory = [];
        
    gm.mysql.handle.query('SELECT * FROM `player_inventory` WHERE `userId` = ?', [playerSQLID], function(error, results) {

        if(error) 
            return sendMessage(player, 'ff4d4d', `[ERROR]:!{ffffff} Items not loaded from MYSQL.`);

        if(results.length > 0) 
        { 
            var localItems = 0;

            for(var invData = 0; invData < results.length; invData ++)
            { 
                player.inventory[localItems] = results[invData]; 
                
                player.inventory[localItems].invUsed = false;

                localItems ++; 
            } 
        }  
    }); 
});
 
//Open inventory
mp.events.add("callPlayerInvetory", (player) => {
 
    if(!player.inventory.length) return sendMessage(player, 'FFFFFF', `You don't have items in inventory.`);
 
    openInventory(player);
}); 
  
function openInventory(player)
{
    var fetchMain = '';
    var fetchClothes = '';

    for(let x = 0; x < player.inventory.length; x++)
    {     
        if(player.inventory[x].type >= 500) 
        { 
            fetchMain += `<div class="item_added"><div class = "box_item"><span class=" badge_trade" id = "badgeid${x}">${player.inventory[x].quantity}</span><div class="card-body text-center" onclick="clickedItem(1, ${x});"><img src="img/items/${player.inventory[x].type}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div> </div><div id = "clicked-item${x}" style = "display: none;"></div></div> `;   
        }
 
        if(player.inventory[x].type < 500) 
        {   
            fetchClothes += `<div class="item_added"><div class = "box_item"><span class=" badge_trade" id = "badgeid${x}">${player.inventory[x].quantity}</span><div class="card-body text-center" onclick="clickedItem(1, ${x});"><img src="img/items/${player.inventory[x].indexItem}.png" style = "width: 50px; margin-top: -55%; margin-left: -15%;"></div> </div><div id = "clicked-item${x}" style = "display: none;"></div></div> `;  
             
            setTimeout(() => {
                if(player.inventory[x].invUsed == true) player.call("add_item_in_caracter", [x, player.inventory[x].invUsed, player.inventory[x].indexItem]);       
            
            }, 500);   
        }   
    }   
    player.call("openInventory", [player.data.drivingLicense, 40, 70, fetchMain, fetchClothes]);  
}
 
//Use item
mp.events.add("onInventoryUse", (player, button, x) => {
 
    var playerHaveError = false; 
    var sendMessagePermission = false;
 
    if(button == 4)
    { 
        //MYSQL
        mysql_action('DELETE FROM `player_inventory` WHERE id = ? LIMIT 1', [player.inventory[x].id]); 
  
        //UPDATE INVENTORY
        player.call("update_badge_plm", [x, false, player.inventory[x].indexItem]);   
 
        switch(player.inventory[x].indexItem)
        { 
            case "jeans":  player.setClothes(4,  0, 0, 0); break; //Jeans
            case "shoes":  player.setClothes(6,  0, 0, 0); break; //Shoes
            case "jacket": player.setClothes(11, 0, 0, 0); break; //Jacket 
            case "hat":     player.setProp(0, 8, 0); break; //Hat
            case "glasses": player.setProp(1, 0, 0); break; //Glasses
        }
 
        player.inventory.splice(x, 1);
 
        //RELOAD INVENTORY
        openInventory(player);
 
        //NOTIFFICATIION
        player.call("showNotification", [`Item dropped successfully.`]);
        return;
    }
 
    //Player use item
    if(button == 2)
    {  
        if(player.inventory[x].type >= 500)
        {  
            switch(player.inventory[x].type)
            {
                //HAMBURGER AND WATER
                case 500:
                {
                    if(player.inventory[x].type == 1 && player.data.hunger >= 100)
                        return player.call("showNotification", [`You are not hungry in this moment.`]), playerHaveError = true;
                  
                    mp.events.call("giveThirstHunger", player, 500, 20);  

                    sendMessagePermission = true; 
                    break; 
                }

                case 501:
                {
                    if(player.inventory[x].type == 2 && player.data.thirst >= 100)
                        return player.call("showNotification", [`You are not thirsty in this moment.`]), playerHaveError = true;
        
                    mp.events.call("giveThirstHunger", player, 501, 20);   

                    sendMessagePermission = true; 
                    break;
                }
            }  
        }  
    }
 
    //ERROR VERIFFICATION
    if(playerHaveError == false)
    {  
        //SEND MESSAGE
        if(sendMessagePermission == true) sendMessage(player, '8080ff', `(Inventory):!{ffffff} Your used ${player.inventory[x].name} new quantity (!{009933}${player.inventory[x].quantity - 1}!{ffffff}).`); 
        
        //CHANGE QUANTITY
        if(button == 2 && player.inventory[x].type >= 500) 
        {
            player.inventory[x].quantity --;
            
            mysql_action('UPDATE `player_inventory` SET quantity = ? WHERE id = ? LIMIT 1', [player.inventory[x].quantity, player.inventory[x].id]); 
        }

        if(button == 2 && player.inventory[x].type < 500)
        {   
            if(player.inventory[x].gender != player.data.gender && player.inventory[x].invUsed == false)
                return player.call("showNotification", [`This item is for ${(player.inventory[x].gender == 0) ? ("male") : ("female")}`]);

            if(player.inventory[x].invUsed == false)
            { 
                for(let i = 0; i < player.inventory.length; i++)
                {     
                    if(player.inventory[i].type < 500 && player.inventory[i].invUsed == true && player.inventory[i].indexItem == player.inventory[x].indexItem) 
                    {  
                        player.inventory[i].invUsed = false;
        
                        player.call("updateBrowser", [button, i, player.inventory[i].quantity, player.inventory[i].invUsed, player.inventory[i].type, player.inventory[i].indexItem, player.inventory[i].name]);  
        
                        mysql_action('UPDATE `player_inventory` SET invUsed = ? WHERE id = ? LIMIT 1', [player.inventory[i].invUsed, player.inventory[i].id]); 
                        break;
                    }
        
                } 
            }
          
            //CHANGE VARIABLE STATUS
            player.inventory[x].invUsed = !player.inventory[x].invUsed; 

            switch(player.inventory[x].indexItem)
            { 
                case "jeans":  player.setClothes(4,  (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Jeans
                case "shoes":  player.setClothes(6,  (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Shoes
                case "jacket": player.setClothes(11, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Jacket 
                case "hat": player.setProp(0, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (8), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0)); break; //Hat
                case "glasses": player.setProp(1, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0)); break; //Glasses
            }

            mysql_action('UPDATE `player_inventory` SET invUsed = ? WHERE id = ? LIMIT 1', [player.inventory[x].invUsed, player.inventory[x].id]); 
        }
  
        //RELOAD INVENTORY
        player.call("updateBrowser", [button, x, player.inventory[x].quantity, player.inventory[x].invUsed, player.inventory[x].type, player.inventory[x].indexItem, player.inventory[x].name]);  

        //REMOVE ITEM
        if(button == 2 && player.inventory[x].type >= 500)
        { 
            //DELETE ITEM 
            if(player.inventory[x].quantity == 0)
            {
                //MYSQL
                mysql_action('DELETE FROM `player_inventory` WHERE id = ? LIMIT 1', [player.inventory[x].id]); 
 
                player.inventory.splice(x, 1);

                openInventory(player);   
            } 
        } 
    }  
}); 
 
//Give player item on inventory
mp.events.add("givePlayerItem", (player, messageAllow = true, itemType, itemAmount, itemName, itemIndex = -1, color, itemGender) => {
 
    let playerNotHaveItem = true;
 
    for(let x = 0; x < player.inventory.length; x++)
    {  
        //If player already have this item, add amount
        if(player.inventory[x].type == itemType && player.inventory[x].quantity > 0 && player.inventory[x].indexItem == itemIndex)
        {
            playerNotHaveItem = false;
            player.inventory[x].quantity += itemAmount; 
  
            //MYSQL
            mysql_action('UPDATE `player_inventory` SET quantity = ? WHERE id = ? LIMIT 1', [player.inventory[x].quantity, player.inventory[x].id]); 

            //MESSAGE
            if(messageAllow == true) sendMessage(player, '8080ff', `(Inventory):!{ffffff} Your item ${itemName} has been updated with cantity (!{009933}${itemAmount}!{ffffff}).`);
            break;  
        }    
    }   

    //Add new item on inventory
    if(playerNotHaveItem == true)
    { 
        //INSERT MYSQL
        gm.mysql.handle.query('INSERT INTO `player_inventory` SET userId = ?, type = ?, indexItem = ?, invColor = ?, name = ?, quantity = ?, gender = ?', [player.data.sqlid, itemType, itemIndex, color, itemName, itemAmount, itemGender], function(err, result, fields) {
            if(err) 
                return console.log(err); 

            //Create push
            const initialObject = {id: result.insertId, userId: player.data.sqlid, type: itemType, indexItem: itemIndex, invColor: color, name: itemName, quantity: itemAmount, gender: itemGender } 
            player.inventory.push(initialObject);   

            //Send message
            if(messageAllow == true) sendMessage(player, '8080ff', `(Inventory):!{ffffff} You received new item: ${itemName} with quantity (!{009933}${itemAmount}!{ffffff}).`);  
        });   
    }  
}); 
 
//Give hunger and thirst items
mp.events.add("giveThirstHunger", (player, option, amount) => {
 
    //MODIFI VARIABLE VALUE
    if(option == 500)
    { 
        player.data.hunger = (player.data.hunger + amount >= 100) ? (100) : (player.data.hunger + amount);
    }
    else 
    {
        player.data.thirst = (player.data.thirst + amount >= 100) ? (100) : (player.data.thirst + amount);
    }

    //UPDATE MYSQL 
    mysql_action('UPDATE `accounts` SET food = ?, water = ? WHERE username = ?', [player.data.hunger, player.data.thirst, player.name]); 
    
    //UPDATE HUD
    player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]); 
}); 

/*

    --------------INVENTORY UPDATES--------------

        - Added key [Y] for open inventory
        - Added button [X] for close inventory
        - Added function for load and add items in inventory
        - Added function for use item
            
            ------(Actual options):------
            
            - Use hamburger
            - Use watter bottle


    
    NEXT UPDATES:

        - Realized CEF for weapons and function for use  this
         








*/