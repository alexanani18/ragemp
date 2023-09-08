//Create browser
var loginBrowser = mp.browsers.new("package://CEF/serverLoginReg/index.html"); 

//Create camera
let camera = mp.cameras.new("camera", new mp.Vector3(-957.93798828125, -2493.306884765625, 44.44485092163086), new mp.Vector3(-10, 0, 15), 55);
camera.pointAtCoord(-956.0208740234375, -2490.068603515625, 42.049659729003906); //
camera.setActive(true);
mp.game.cam.renderScriptCams(true, false, 0, true, false); 
 
setTimeout(() => {
    
    mp.gui.cursor.visible = true;   

}, 1000);

   
mp.events.add("checkData", (state, loginName, loginPass, playerEmail) => { 
   
    //                                                 ------Login------    ---Register---
    mp.events.callRemote("loginConnectPlayer", state, loginName, loginPass,  playerEmail);
}); 
 
mp.events.add("destroyLoginBrowser", () => { 

    if(loginBrowser)
    {
        //Destroy browser
        loginBrowser.destroy();
        loginBrowser = null;

        mp.gui.cursor.visible = false;   
 
        //Destroy camera 
        if(camera)
        {
            camera.destroy();
            camera = null;
        }
       
        //camera.destroy();
        mp.game.cam.renderScriptCams(false, false, 3000, true, true); 
        
        //Show chat
        mp.events.call("ToggleChatBoxActive", true); 

        //Hide cursor
        mp.gui.cursor.visible = false;  
 
        mp.players.local.freezePosition(false);   
    } 
});
  
function preloadAccountInfo(state) {

    //Login account
    const loginName = document.getElementById("loginName");
    const loginPass = document.getElementById("loginPass");
 
    //Register account 
    const playerEmail = document.getElementById("registerEmail");
 

    //                             -------------Login--------------  ------Register-----
    mp.trigger("checkData", state, loginName.value, loginPass.value, playerEmail.value);
} 
 