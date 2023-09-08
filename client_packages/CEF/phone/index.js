let phone_browser = null;
 
mp.keys.bind(0x50, true, function() {
 
    if(isChatActive() == false) 
    { 
        if(phone_browser == null)
        {
            phone_browser = mp.browsers.new("package://CEF/phone/home.html");   
            mp.gui.cursor.visible = true;  
        } 
        else 
        {
            phone_browser.destroy();
            phone_browser = null;
            mp.gui.cursor.visible = false; 
        }
    }
});