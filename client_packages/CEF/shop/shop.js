let shopBrowser = null;

//Create CEF
mp.events.add("accessingShop", () =>
{   
    if(shopBrowser == null) 
    {
        shopBrowser = mp.browsers.new("package://CEF/shop/index.html");

        mp.gui.cursor.visible = true;
    }
     
});  
/*mp.keys.bind(0x4E, true, function() {
 
	if(isChatActive() == false) mp.events.call("accessingShop");	
}); */
  
//Preload to function click buttons
mp.events.add("receiver_shop_items", (button, payType, itemType, itemName, itemAmount, itemPrice) => { 
 
    if(button == 0)
    { 
        if(shopBrowser != null) 
        {
            shopBrowser.destroy();
            shopBrowser = null;

            mp.gui.cursor.visible = false; 
        }
        return;
    }

    //Send info in server-side
    if(button == 2)
        mp.events.callRemote("load_shop_items", itemType, itemName, itemAmount, itemPrice, payType);
}); 