let bankBrowser = null;


mp.keys.bind(0x45, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("accesingBankBrowser", 1);	
});

mp.events.add("showPlayerBank", (name, money, recentTransactions) =>
{  
    if(bankBrowser == null) 
    { 
        bankBrowser = mp.browsers.new("package://CEF/bankSistem/index.html");   
        mp.gui.cursor.visible = true;  
    } 

    if(bankBrowser != null)
    { 
        bankBrowser.execute(`document.getElementById('bankInfo-placeholder').innerHTML = '<h3>Welcome back, ${name}!</h3><p>Your credit: <span class="color-green">$${money}</span>.</p>'`);  
 
        bankBrowser.execute(`document.getElementById('recentTransactions-placeholder').innerHTML = '${recentTransactions}'`);  
    }
}); 

mp.events.add("onPlayerBankEvent", (button, moneyWithdraw, moneyDeposited, moneyUsername, moneyAmount) => { 
 
    switch(button)
    {
        case 0: 
        {
            mp.events.call("closeBankBrowser", button); 
            break;
        } 
        case 1: 
        {
            mp.events.callRemote("sendBankInfo", button, moneyWithdraw, moneyDeposited, moneyUsername, moneyAmount);	
            break;
        }
        case 2: 
        {
            mp.events.callRemote("sendBankInfo", button, moneyWithdraw, moneyDeposited, moneyUsername, moneyAmount);
            break;
        }	
        case 3:
        {
            mp.events.callRemote("sendBankInfo", button, moneyWithdraw, moneyDeposited, moneyUsername, moneyAmount);
            break;
        }
    } 
}); 

mp.events.add("closeBankBrowser", (button) => { 
 
    if(bankBrowser != null)
    {
        bankBrowser.destroy();
        bankBrowser = null; 

        mp.gui.cursor.visible = false;   
    } 
}); 
 
function onPlayerClickBank(button)
{
    let moneyWithdraw = document.getElementById("withdraw_amount"); 
    let moneyDeposite = document.getElementById("deposit_amount"); 
    
    //Transfer
    let moneyUsername = document.getElementById("transfer_username"); 
    let moneyAmount = document.getElementById("transfer_amount"); 

    mp.trigger("onPlayerBankEvent", button, moneyWithdraw.value, moneyDeposite.value, moneyUsername.value, moneyAmount.value); 
}