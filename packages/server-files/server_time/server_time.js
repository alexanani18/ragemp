//SET SERVER TIME
const date = new Date(); 
mp.world.time.set(date.getHours(), date.getMinutes(), date.getSeconds());

setInterval(() => {

	//THIRST AND HUNGER SISTEM
	mp.players.forEach(player => { 
        if(player.loggedInAs == true) { 
    
            //Thirst & Hunger
            if(player.data.hunger > 0)
            {
                player.data.hunger -= 0; 

                if(player.data.hunger == 15)
                {
                    sendMessage(player, 'ff6600', `( Hunger :hunger: ):!{ffffff} Hunger is now !{ff6600}15!{ffffff}% go to store and eat something.`);   
                }
            }
  
            if(player.data.thirst > 0)
            {
                player.data.thirst -= 0; 

                if(player.data.thirst == 20)
                {
                    sendMessage(player, '33bbff', `( Thirst :thirst: ):!{ffffff} Thirst is now !{33bbff}20!{ffffff}% go to store and drink something.`);   
                }
            }
 
            //Update HUD
            player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]); 

            //Update MYSQL
            mysql_action('UPDATE `accounts` SET food = ?, water = ? WHERE username = ? LIMIT 1', [player.data.hunger, player.data.thirst, player.name]);  
        } 
    }); 

    //SET SERVER TIME
	const date = new Date();  
    mp.world.time.set(date.getHours(), date.getMinutes(), date.getSeconds()); 

}, 60000);