require('../mysql.js');
require('../index.js');
  
const atmPosition = [
    [],
    [-95.54, 6457.14, 31.46],
	[-97.26, 6455.38, 31.46],
	[155.828, 6642.827, 31.602],
	[174.161, 6637.827, 31.573],
	[1701.28, 6426.46, 32.76],
	[112.483, -818.976, 31.342],
	[111.323, -775.486, 31.437],
	[114.181, -776.757, 31.418],
	[296.444, -893.988, 29.231],
	[295.694, -896.069, 29.214],
	[147.726, -1035.783, 29.343],
	[145.947, -1035.146, 29.345],
	[289.01, -1256.83, 29.441],
	[1703, 4933.5, 42.06],
	[1968.13, 3743.56, 32.34],
	[2683, 3286.5, 55.21],
	[-611.92, -704.75, 31.26],
	[-614.6, -704.75, 31.26]
];

//Create ATM 3dText 
for(let x = 1; x < atmPosition.length; x ++)
{ 
    mp.labels.new(`ATM ~r~(${x})~s~\nPress ~r~E~s~ key`, new mp.Vector3(atmPosition[x][0], atmPosition[x][1], atmPosition[x][2]),
    {
        los: false,
        font: 4,
        drawDistance: 20,
        dimension: 0
    });
 
    mp.blips.new(431, new mp.Vector3(atmPosition[x][0], atmPosition[x][1], atmPosition[x][2]), 
    {
        name: `ATM ~r~(${x})`,
        scale: 0.8,
        color: 25,
        drawDistance: 5,
        shortRange: true,
        dimension: 0,
    });  
}
 
mp.events.addCommand('gotoatm', (player, id) => {   

    if(!id) return sendUsage(player, '/gotoatm [atm id]'); 
    if(player.data.admin < 2) return player.outputChatBox("You don't have admin level 2.");
    if(id > atmPosition.length || id < 1) return sendMessage(player, '009933', 'Invalid atm ID.');
 
    player.position = new mp.Vector3(atmPosition[id][0], atmPosition[id][1], atmPosition[id][2]);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to atm ${id}.`); 
}); 


mp.events.add("accesingBankBrowser", (player, option) => { 

    for(let x = 1; x < atmPosition.length; x ++)
    { 
        if(player.IsInRange(atmPosition[x][0], atmPosition[x][1], atmPosition[x][2], 3))
        {   
            mp.events.call('accesingBankBrowser2', player, option); 
            break;
        }
    }
});

mp.events.add("accesingBankBrowser2", (player, option) => { 
    let texts = '';

    switch(option)
    {
        case 0: break;
        case 1: 
        {    
            gm.mysql.handle.query('SELECT * FROM `player_transactions` WHERE `playerSQLID` = ? ORDER BY transactionID DESC LIMIT 3', [player.data.sqlid], function(err, results) {  
                 
                if(!results.length) texts = '<br><h4>No recent transactions...<h4><br>';
                 
                for(let i = 0; i < results.length; i++) 
                {   
                    texts += `${(results[i].transactionType == 0 ? ('<div class="transaction transaction-yellow"><i class="fas fa-wallet"></i>') : results[i].transactionType == 1 ? ('<div class="transaction transaction-red"><i class="fas fa-share"></i>') : ('<div class="transaction transaction-green"><i class="fas fa-briefcase"></i>'))}<div class="transaction-info"><h4 id="transaction-type">${(results[i].transactionType == 0 ? ('Withdraw') : results[i].transactionType == 1 ? ('Transfer') : ('Deposit'))}</h4><p id="transaction-amount" class="color-green">$-${results[i].playerAmount}</p></div><p id="transaction-time">${results[i].transactionDate}</p></div>`;
                }  
                
                player.call('showPlayerBank', [player.name, player.formatMoney(player.data.moneyBank, 0), texts]);  
            });    
            break;
        } 
    } 
});  
 
mp.events.add("sendBankInfo", (player, button, moneyWithdraw, moneyDeposited, transferUsername, transferAmount) => { 

    switch(button)
    {
        case 0: break;
        
        //Withdraw money
        case 1: 
        {        
            if(player.data.moneyBank < moneyWithdraw)
            {
                player.call("showNotification", [`You dont have this amount.`]);
                mp.events.call("accesingBankBrowser", player, 1); 
                return;
            }
                  
            player.give_money_bank(1, moneyWithdraw);  
            player.giveMoney(0, moneyWithdraw);

            mysql_action('INSERT INTO `player_transactions` SET playerSQLID = ?, playerAmount = ?, transactionType = ?, transactionDate = ?', [player.data.sqlid, parseInt(moneyWithdraw), 0, getDates()]); 
             
            //Update browser 
            mp.events.call("accesingBankBrowser", player, 1); 
  
            //Send player notiffication
            player.call("showNotification", [`You retired <a style="color:green;">${player.formatMoney(moneyWithdraw, 0)}</a>$ from your account.`]); 
            break;
        }

        //Deposit money
        case 2:
        {  
            if(player.data.money < moneyDeposited)
            {
                player.call("showNotification", [`You dont have this amount.`]);
                mp.events.call("accesingBankBrowser", player, 1); 
                return;
            }
                   
            player.give_money_bank(0, moneyDeposited); 
            player.giveMoney(1, moneyDeposited);

            mysql_action('INSERT INTO `player_transactions` SET playerSQLID = ?, playerAmount = ?, transactionType = ?, transactionDate = ?', [player.data.sqlid, parseInt(moneyDeposited), 2, getDates()]); 

            //Update browser
            mp.events.call("accesingBankBrowser", player, 1); 

            //Send player notiffication
            player.call("showNotification", [`You deposited <a style="color:green;">${player.formatMoney(moneyDeposited, 0)}</a>$ in your account.`]); 
            break; 
        }

        //Transfer money
        case 3:
        {
            const user = getNameOnNameID(transferUsername);

            if(user == undefined)
            {
                player.call("showNotification", [`This player is not connected.`]);
                mp.events.call("accesingBankBrowser", player, 1); 
                return;
            }
                  
            if(player.data.moneyBank < transferAmount)
            {
                player.call("showNotification", [`You dont have this amount.`]);
                mp.events.call("accesingBankBrowser", player, 1); 
                return;
            } 
 
            //Sender acctions 
            player.give_money_bank(1, transferAmount);
            player.call("showNotification", [`You transfered <a style="color:green;">${player.formatMoney(transferAmount, 0)}</a>$ to ${user.name}.`]); 
           
            //Receiver acctions 
            user.call("showNotification", [`You received <a style="color:green;">${user.formatMoney(transferAmount, 0)}</a>$ from ${player.name}.`]);  
            user.give_money_bank(0, transferAmount);

            //PLAYER BANK MENU 
            mysql_action('INSERT INTO `player_transactions` SET playerSQLID = ?, playerAmount = ?, transactionType = ?, transactionDate = ?', [player.data.sqlid, parseInt(transferAmount), 1, getDates()]); 
            mp.events.call("accesingBankBrowser", player, 1);   
            break;
        }
    }   
});    