let hudBrowser = null; 
let buttonsInformations = null;
const month = ["january", "february", "march", "april", "mai", "may", "june", "july", "august", "september", "october", "november", "december"]; 
const date = new Date();   
 
function getDates() 
{
    return `${date.getDate()} ${month[new Date().getMonth()]} 2021`;
}

mp.events.add("openPlayerHud", (playerMoney, playerBank, health, armour, hunger, thirst, infoStatus) =>
{  
	if(hudBrowser == null) 
	    hudBrowser = mp.browsers.new("package://CEF/hud/index.html");  

 
	if(buttonsInformations == null)
	{
		buttonsInformations = mp.browsers.new("package://CEF/hud/helping.html");
		buttonsInformations.execute(`document.querySelector('body').style.display = '${(infoStatus == 1) ? ("block") : ("none")}'`);   
	}
	else 
	{
		buttonsInformations.execute(`document.querySelector('body').style.display = '${(infoStatus == 1) ? ("block") : ("none")}'`);    
	}
  
	//Change money
	hudBrowser.execute("updateMoney('" + playerMoney + "', '" + playerBank + "');");  
	
	//Change progress bars
	hudBrowser.execute("updateProgress('" + health + "', '" + armour + "', '" + hunger + "', '" + thirst + "');");  

	//Change microphone status
	hudBrowser.execute("isTalking('" + (!mp.voiceChat.muted ? '#128c08' : '#ff1a1a') + "');");   

	//Update wanted
	hudBrowser.execute("updateWanted('" + 0 + "', '" + 10 + "');");     
 
	const hourText = `${date.getHours()} : ${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;

	//Update Dat  
	hudBrowser.execute("updateDate('" + getDates() + "', '" + hourText + "');");  
}); 


setInterval(() => {

	const hourText = `${date.getHours()} : ${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;

	if(hudBrowser)
	    hudBrowser.execute("updateDate('" + getDates() + "', '" + hourText + "');");  
	
}, 60000);


//Show/hide cursor
mp.keys.bind(0x79, true, function() {
 
    if(isChatActive() == false) 
    { 
        mp.gui.cursor.visible = !mp.gui.cursor.visible;    
    }
}); 
 
/*mp.events.add('render', () => {

	const player = mp.players.local;

	if(hudBrowser)
	{  
		//Change date 
		hudBrowser.execute("updateDate('" + getDates() + "');");   
 
	}  
});*/  
 
mp.events.add("modifiMicrophone", () =>
{   
	//Change microphone
    if(hudBrowser)
        hudBrowser.execute("isTalking('" + (!mp.voiceChat.muted ? '#128c08' : '#ff1a1a') + "');");   
});   
 
mp.events.add("edit_wantedLevel", (wantedLevel, wantedTime) =>
{   
	//CHANGE WANTED LEVEL
    if(hudBrowser != null) 
		hudBrowser.execute("updateWanted('" + wantedLevel + "', '" + Calculate(wantedTime) + "');");    
});   

//TRUCKER INFO
mp.events.add('onJobTimer', (city, location) => { 
 
	if(hudBrowser != null) 
	{
		hudBrowser.execute("set_job_hud_text('" + city + "', '" + location + "');");     
	} 
});

//Find player
mp.events.add('one_find_hud', (text) => { 
 
	if(hudBrowser != null) 
	{
		hudBrowser.execute("set_find_hud('" + text + "');");     
	} 
});

mp.events.add('update_health', (health) => { 
 
	if(hudBrowser != null) 
	{
		hudBrowser.execute("set_health('" + health + "');");     

		mp.gui.chat.push(health);
	} 
});