let storeBrowser = null;
 

mp.keys.bind(0x45, true, function() {
 
    mp.events.callRemote("accesingStore", 1);	
});
 
mp.events.add("showPlayerStore", (player) =>
{  
    if(storeBrowser == null) 
    { 
        storeBrowser = mp.browsers.new("package://CEF/business/store24/store24.html");  
  
        mp.gui.cursor.visible = true;  
    } 
});  
 
mp.events.add("onPlayerClickStore", (button, product, price, type, itemID) => { 
 
    switch(button)
    {
        //Close menu
        case 0: 
        {
            if(storeBrowser != null)
            {
                storeBrowser.destroy();
                storeBrowser = null;
        
                mp.gui.cursor.visible = false;   
            } 
            break;
        } 

        //Buy product
        case 1: 
        {  
            mp.events.callRemote("accesingStore", 2, product, price, type, itemID);	
            break;
        }
    } 
});
  
function playerClickStore(option, product, price, type, itemID) 
{  
    mp.trigger("onPlayerClickStore", option, product, price, type, itemID);  
} 