let admin_browser_help = null;
 
mp.events.add('show_admin_help', () => {
 
    if(admin_browser_help == null) admin_browser_help = mp.browsers.new("package://CEF/helping/admin_help/index.html");
    
    mp.gui.cursor.visible = true;  
});

function destroy_browser() { mp.trigger("closePlayerHouseMenu"); }     
  
mp.events.add("closePlayerHouseMenu", () => { 

    if(admin_browser_help != null)
    { 
        admin_browser_help.destroy();
        admin_browser_help = null;

        mp.gui.cursor.visible = false; 
    }
});
