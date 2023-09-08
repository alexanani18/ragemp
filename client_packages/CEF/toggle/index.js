var tog_browser = null;

mp.keys.bind(0x51, true, function() {
 
    if(isChatActive() == false) 
    { 
        //mp.events.callRemote("open_tog");  
    } 
});

mp.events.add('show_tog_menu', (statusOne, statusTwo) => {
 
    if(tog_browser == null) 
    {
        tog_browser = mp.browsers.new("package://CEF/toggle/index.html");  
    }

    if(tog_browser) 
    {
        tog_browser.execute("open_tog('" + statusOne + "', '" + statusTwo + "');");   
    }

    mp.gui.cursor.visible = true;  
});

mp.events.add('destroy_browser', () => {

    if(tog_browser)
    {
        tog_browser.destroy();
        tog_browser = null;

        mp.gui.cursor.visible = false; 
    }
});


mp.events.add("load_informations", (option, status) => { 
 
    mp.events.callRemote("send_tog_info", option, (status == true ? (1) : (0)));  
});