let rentCarBrowser = null;
let dealershipBrowser = null;  
  
//Rent car browser
mp.events.add('showRentBrowser', (player, text) => {

    if(rentCarBrowser == null) rentCarBrowser = mp.browsers.new("package://CEF/rentCar/rentCar.html"); 
    mp.gui.cursor.visible = true; 
 
    rentCarBrowser.execute(`document.getElementById('rentCarInfo-placeholder').innerHTML = '${text}'`);  
});
 
function sendRentInfo(state) { mp.trigger("sendRentInfo2", state); } 
mp.events.add("sendRentInfo2", (state) => { 

    switch(state)
    {
        case 0:
        {
            if(rentCarBrowser != null) {
                rentCarBrowser.destroy();

                rentCarBrowser = null; 
                mp.gui.cursor.visible = false;  
                return;
            } 
        }
        default: return mp.events.callRemote("playerPressRentButton", state); 
    } 
});
 
mp.events.add('closePlayerRentBrowser', () => {

    if(rentCarBrowser != null) {
        rentCarBrowser.destroy();

        rentCarBrowser = null; 
        mp.gui.cursor.visible = false;
        return; 
    } 
}); 