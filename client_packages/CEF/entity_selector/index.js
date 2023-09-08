let entity_interraction = null;
var status_open = false; 

mp.keys.bind(0x4F, true, function() { //- O key
 
    if(isChatActive() == false) 
    {
        if(entity_interraction == null && status_open == false) 
        { 
            entity_interraction = mp.browsers.new("package://CEF/entity_selector/index.html");   
            entity_interraction.execute(`document.querySelector('body').style.display = 'block'`);   
            status_open = true;
        } 

        if(status_open == true)
        {
            entity_interraction.execute(`open_menu();`);
        }

        mp.gui.cursor.visible = true;  
    }
}); 
 

mp.events.add("clicked_category", (id, title) => {

    if(id == 0)
        return mp.gui.cursor.visible = false; 


    mp.events.callRemote("apply_entity_select", id, title);  
});


mp.events.add('click', (x, y, upOrDown, leftOrRight, relativeX, relativeY, worldPosition, hitEntity) => {
    
    if(upOrDown == "down")
    { 
        //mp.events.callRemote("click_entity", x, y); 
    }  
});
 
mp.events.add("accessing_menu_event", () => {

    mp.gui.cursor.visible = false; 
 
    //aici sa apeleze o functie in package iar cand playerul selecteaza ceva sa ii reapara browserul
    entity_interraction.execute(`document.querySelector('body').style.display = 'none'`);   
 
    setTimeout(() => {
        
        mp.gui.cursor.visible = true;
        entity_interraction.execute(`execute_final_plm();`);

    }, 2000); 
});