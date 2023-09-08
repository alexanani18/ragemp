let invBrowser = null;
 
//Key [I]
mp.keys.bind(0x49, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("callPlayerInvetory");	
});
 
mp.events.add("openInventory", (playerDriving, playerFlying, playerWeapon, fetchMain, fetchClothes) => { 
 
    if(invBrowser == null) 
    { 
        invBrowser = mp.browsers.new("package://CEF/inventory/index.html");    
        mp.gui.cursor.visible = true; 
    } 

    if(invBrowser != null)
    {   
        //Show items 
        invBrowser.execute(`addItems(${playerDriving}, ${playerFlying}, ${playerWeapon}, '${fetchMain}', '${fetchClothes}');`);   
    }    
}); 
 
mp.events.add("add_item_in_caracter", (x, status, index) => { 
 
    if(invBrowser != null)
    {    
        invBrowser.execute(`document.getElementById('badge-item${x}').innerHTML = '${(status == 1) ? ("in use") : ("")}'`);  
        invBrowser.execute(`document.getElementById('${index}').innerHTML = '<img width="120%" src="./img/items/${index}.png">'`);   
    }     
});

mp.events.add("update_badge_plm", (x, status, index) => { 
 
    if(invBrowser != null)
    {    
        invBrowser.execute(`document.getElementById('${index}').innerHTML = ''`);    
    }     
});
 
mp.events.add("updateBrowser", (button, x, amount, status, type, index, name) => { 
  
    invBrowser.execute("updateBrowsers('" + x + "', '" + amount + "', '" + button + "');");  
    invBrowser.execute(`document.getElementById('clicked-item${x}').innerHTML = '${(status == true && type < 500) ? (`<span class = "badge_buttons" style="background-color: red; padding: 0.1px 4.2px;" onclick = "clickedItem(2, ${x}, ${amount}, ${status});"><i class="fa fa-times"></i></span>`) : (`<span class = "badge_buttons" style="background-color: green; padding: 0.1px 3.5px;" onclick = "clickedItem(2, ${x}, ${amount}, ${status});"><i class="fa fa-check"></i></span>`)} <span class = "badge_buttons" style="background-color: #0066ff; padding: 0.1px 7px;" onclick = "clickedItem(3, ${x}, ${amount}, ${status});"><i class="fa fa-question "></i></span> <span class = "badge_buttons" style="background-color: red; padding: 0.1px 4.2px;" onclick = "clickedItem(${4}, ${x});"><i class="fa fa-trash"></i></span><br>'`);     
  
    switch(button)
    { 
        //USE ITEM
        case 2:
        { 
            //CLOTHING
            if(type < 500)
            { 
                //CHANGE STATUS (USED / REMOVED) 
                invBrowser.execute(`document.getElementById('badge-item${x}').innerHTML = '${(status == true) ? ("in use") : ("")}'`);  
                
                //PUT IMAGE IN CHARACTER DIV
                invBrowser.execute(`document.getElementById('${index}').innerHTML = '${(status == true) ? (`<img width="120%" src="./img/items/${index}.png">`) : ("")}'`);    
            } 
            break;
        }

        //INFO ITEM
        case 3:
        {   
            var badgeName = `${(status == true) ? (`- <span class="badge badge-sm badge-success badge-sm" id = "badge-item${x}">in use</span>`) : (`- <span class="badge badge-sm badge-danger badge-sm" id = "badge-item${x}">not used</span>`)}`; 
   
            invBrowser.execute(`infoItem('${x}', '${type}', '${amount}', '<h6>${name} ${type < 500 ? (badgeName) : ("")}</h6>', '${index}');`);  
            break;
        }
    }  
}); 
 
mp.events.add("clickButtonInv", (button, x) => { 
  
    if(button == 0)
    {
        if(invBrowser != null)
        {
            invBrowser.destroy();
            invBrowser = null;

            mp.gui.cursor.visible = false; 
        }
        return;
    }
  
    mp.events.callRemote("onInventoryUse", button, x);  
}); 