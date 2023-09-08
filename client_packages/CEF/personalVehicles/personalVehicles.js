let personalVehicleBrowser = null;
let dealershipBrowser = null;
let camera = null;
let vehicleSelected = null;

//----------------------------------------------------------------------------- [ DEALERSHIP VEHICLES ] -----------------------------------------------------------------------------\\

mp.events.add('prepareDealership', (type) => {

    if(type == 0)
    {
        camera = mp.cameras.new("camera", new mp.Vector3(-42.90960693359375, -1099.7279052734375, 27.230844497680664), new mp.Vector3(0, 0, 30), 60);
        camera.pointAtCoord(-27.7695, -1106.1680, 25.5219);
        camera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false); 
    }
    else 
    {
        camera.destroy();
        mp.game.cam.renderScriptCams(false, false, 3000, true, true); 
    }
});

//Dealership sistem
mp.events.add('showDealershipBrowser', (player, vehicleModel, vehiclePrice, vehicleStock) => {

    if(dealershipBrowser == null) dealershipBrowser = mp.browsers.new("package://CEF/personalVehicles/dealership.html"); 
    mp.gui.cursor.visible = true; 
  
    dealershipBrowser.execute("showDealerFunc('" + vehicleModel + "', '" + vehiclePrice + "', '" + vehicleStock + "');");   
    return;
});

mp.events.add('udateDealershipBrowser', (vehicleModel, vehiclePrice, vehicleStock) => {
 
    if(dealershipBrowser != null) dealershipBrowser.execute("updateDealerVehicle('" + vehicleModel + "', '" + vehiclePrice + "', '" + vehicleStock + "');");   
    return;
});
 
 
mp.events.add("clickDealershipButton", (state, rotation) => { 
  
    //Close CEF
    if(state == 0 && dealershipBrowser != null) {
        dealershipBrowser.destroy();

        dealershipBrowser = null; 
        mp.gui.cursor.visible = false;   
    }  
  
    mp.events.callRemote("clickDealershipButtonS", state, rotation); 
});
 
 
//----------------------------------------------------------------------------- [ PERSONAL VEHICLES ] -----------------------------------------------------------------------------\\

mp.events.add('showPlayerVehicles', (text) => {

    if(personalVehicleBrowser == null) personalVehicleBrowser = mp.browsers.new("package://CEF/personalVehicles/index.html"); 
    mp.gui.cursor.visible = true; 
 
    personalVehicleBrowser.execute(`document.getElementById('vehiclePersonal-placeholder').innerHTML = '${text}'`);  
    return;
});

function sendPVehicleInfo(button, info) 
{
    mp.trigger("sendPVehicleInfoNext", button, info); 
} 

mp.events.add("sendPVehicleInfoNext", (button, info) => { 
 
    vehicleSelected = info;
    mp.events.callRemote("clickPersonalVehicleButton", button, info); 
    switch(button)
    {
        case -1:
        {
            if(personalVehicleBrowser != null) 
            {
                personalVehicleBrowser.execute(`document.getElementById("placeholder1").style.display = 'none';`);

                personalVehicleBrowser.destroy(); 
                personalVehicleBrowser = null; 

                mp.gui.cursor.visible = false;   
                break;
            }  
        } 

        case 0: 
        { 
            personalVehicleBrowser.execute(`document.getElementById("placeholder1").style.display = 'none';`);
            personalVehicleBrowser.execute(`document.getElementById("placeholder1").style.display = 'block';`);
            break;
        }
    } 
});  

mp.events.add("editVehicleColor", (colorOne, colorTwo, colorThree) => { 
  
    mp.events.callRemote("editVehicleColor_execute", vehicleSelected, colorOne, colorTwo, colorThree); 
}); 
 
mp.events.add("showPlayerMore", (info, vehicleID, vehicleName, vehicleOdometer, vehicleNumber, vehicleRegister) => { 
   
    //Veh name
    personalVehicleBrowser.execute(`document.getElementById('vehicleName-placeholder').innerHTML = '${vehicleName}'`);   

    //Veh odoometer
    personalVehicleBrowser.execute(`document.getElementById('vehicleOdometer-placeholder').innerHTML = '${vehicleOdometer} km'`);   

    //Veh number
    personalVehicleBrowser.execute(`document.getElementById('vehicleNumber-placeholder').innerHTML = '${vehicleNumber}'`);   

    //Veh register date
    personalVehicleBrowser.execute(`document.getElementById('vehicleRegister-placeholder').innerHTML = '${vehicleRegister}'`);    

    //Show player buttons
    personalVehicleBrowser.execute(`document.getElementById('buttonsMore-placeholder').innerHTML = '${vehicleID == -1 ? (`<button style="border-radius: 200px;" type = "button" class = "btn btn-outline-success btn-block btn-sm" onclick = "sendPVehicleInfo(1, ${info});">Spawn <i class="fa fa-check" aria-hidden="true"></i></button>`) : (`<button style="border-radius: 200px;" type = "button" class = "btn btn-outline-danger btn-block btn-sm" onclick = "sendPVehicleInfo(1, ${info});">Despawn <i class="fa fa-times" aria-hidden="true"></i></button>`)} <button style="border-radius: 200px;" type = "button" class = "btn btn-outline-info btn-block btn-sm" onclick = "sendPVehicleInfo(2, ${info});">Find <i class="fa fa-map-marker" aria-hidden="true"></i></button> <button style="border-radius: 200px;" type = "button" class = "btn btn-outline-warning btn-block btn-sm">Tow <i class="fa fa-location-arrow" aria-hidden="true"></i></button>'`);    
});   