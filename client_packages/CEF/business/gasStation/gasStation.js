let gasBrowser = null; 
var liters = 0;

mp.keys.bind(0x45, true, function() {
 
    mp.events.callRemote("accesingGasBrowser", 2);	
});
 
mp.events.add("showPlayerGasStation", () =>
{  
    if(gasBrowser == null) 
    { 
        liters = 0

        gasBrowser = mp.browsers.new("package://CEF/business/gasStation/index.html");  

        mp.gui.cursor.visible = true;  
    } 
}); 

mp.events.add("onPlayerGasEvent", (button, payOption) => { 
 
    switch(button)
    {
        case 0: 
        {
            if(gasBrowser != null)
            {
                gasBrowser.destroy();
                gasBrowser = null; 
        
                mp.gui.cursor.visible = false;   
            } 
            break;
        }
        case 1:
        { 
            mp.events.callRemote("accesingGasBrowser", button, 500 * liters, liters, payOption);   
            break;
        }
    } 
}); 
 
mp.events.add("closeBrowserGas", () => { 

    if(gasBrowser != null)
    {
        gasBrowser.destroy();
        gasBrowser = null; 

        mp.gui.cursor.visible = false;   
    } 
});


mp.events.add("start_fill_final", (payOption) => { 

    gasBrowser.execute(`start_fill(${liters}, ${payOption});`);  
});
 
mp.events.add("put_gas", (option, payOption) => { 

    if(option == 3)
    {
        mp.events.callRemote("start_gass_fill", 500 * liters, payOption);   
    }
    else 
    {
        const player = mp.players.local;
 
        if(player.vehicle.getVariable('vehicleGass') + liters == 100) 
        {
            mp.events.call("showNotification", ['Your fuel tank is now 100%.']);	
            return;
        }
     
        (option == 1) ? (liters ++) : (liters --)  
      
        gasBrowser.execute(`document.getElementById('checkout_info').innerHTML = '<a style = "color: #009933;" id="checkout_info">${500 * liters}</a>$ (for <span style="color: #ff3300;">${liters}</span> liters)</span>'`);
    } 
});  