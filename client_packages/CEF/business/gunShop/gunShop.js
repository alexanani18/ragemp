let gunShopBrowser = null;
  
mp.keys.bind(0x45, true, function() {
 
    mp.events.callRemote("accesingGunShop", 1);	
});
 
mp.events.add("showPlayerGuns", (player) =>
{  
    if(gunShopBrowser == null) 
    { 
        gunShopBrowser = mp.browsers.new("package://CEF/business/gunShop/index.html");  
  
        mp.gui.cursor.visible = true;   
    } 
});  

mp.events.add("onPlayerClickGuns", (button, gunName, gunPrice, gunBullets, type) => { 

    switch(button)
    {
        case 0:
        {
            if(gunShopBrowser != null)
            {
                gunShopBrowser.destroy();
                gunShopBrowser = null; 

                mp.gui.cursor.visible = false;   
                break;
            } 
        }
        //Buy product
        case 1:
        {  
            mp.events.callRemote("accesingGunShop", 2, gunName, gunPrice, gunBullets, type);	
            break;
        } 
    } 
});
  

function playerClickGunShop(button, gunName, gunPrice, gunBullets, type)
{ 
    mp.trigger("onPlayerClickGuns", button, gunName, gunPrice, gunBullets, type);  
}