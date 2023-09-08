var serverCityWhater = 'brasov';  
const fetch = require('node-fetch');
const url = `http://api.weatherapi.com/v1/current.json?key=c5aab2441e9248e49ee81903201910&q=${serverCityWhater}`;
 
if(serverCityWhater)
{
    setInterval(() => {   
        fetch(url)
        .then(res => res.json())
        .then(json => {
            let code = json.current.condition.code;
        
            switch (code) {
                case 1000: mp.world.weather = 'EXTRASUNNY'; break;
                case 1003: mp.world.weather = 'CLOUDS'; break;
                case 1006: mp.world.weather = 'CLOUDS'; break;          
                case 1066: mp.world.weather = 'XMAS'; break;   
                case 1219: mp.world.weather = 'SNOW'; break;   
                case 1225: mp.world.weather = 'SNOW'; break;                   
                case 1135: mp.world.weather = 'FOGGY'; break;
                case 1183: mp.world.weather = 'RAIN'; break;
                case 1189: mp.world.weather = 'RAIN'; break;
                case 1273: mp.world.weather = 'THUNDER'; break; 
                default:   mp.world.weather = 'CLEAR';
            }
    
            console.log(`[WEATHER-SYNC] Server weather is synced with ${serverCityWhater} ${json.current.condition.text} (${json.current.condition.code})`);
        })
        .catch(function(err){
          console.log("There was an error running the weather.js script ! ", err)
        });  
    
    }, 60000)
}
 
mp.events.addCommand('weather', (player, city) => {  
      
    if(!city) 
    {
        sendUsage(player, '/weather [city]'); 
        sendMessage(player, '8080ff', 'EX:!{ffffff} /weather bucharest'); 
        return;
    }
 
    serverCityWhater = city; 
    sendToAll(`8080ff`, `(Weather):!{ffffff} ${player.name} [${player.id}] change server weather to !{8080ff}${city}!{ffffff} city.`);  
});