let speedo = mp.browsers.new("package://CEF/speedometer/index.html"); 
let showed = false;
const player = mp.players.local;

mp.events.add('render', () =>
{ 
	if(player.vehicle && player.vehicle.getPedInSeat(-1) === player.handle)
	{
		if(showed === false)
		{
			speedo.execute(`showSpeedo(${player.vehicle.getVariable('vehicleGass')});`);
			
		    speedo.execute(`toggleProp(${player.getVariable('seatBelt')}, ${player.vehicle.getVariable('engineStatus')}, ${player.vehicle.getVariable('vehicleDoors')}, ${0});`); 
			 
			speedo.execute(`setFuel(${player.vehicle.getVariable('vehicleGass')});`);
			showed = true;
		}

		const lightState = player.vehicle.getLightsState(1,1);
		const speed = (player.vehicle.getSpeed() * 3.6).toFixed(0); 
		const speedMax = mp.game.vehicle.getVehicleModelMaxSpeed(mp.players.local.vehicle.model); 
		  
		speedo.execute(`update(${speed}, ${((speedMax * 3.6).toFixed(0))}, ${lightState.lightsOn}, ${lightState.highbeamsOn});`); 
	}
	else
	{
		if(showed)
		{
			speedo.execute("hideSpeedo();");
			showed = false;
		}
	}
});
 
mp.events.add('update_speedometer', () => {
 
	if(player.vehicle) speedo.execute(`toggleProp(${player.getVariable('seatBelt')}, ${player.vehicle.getVariable('engineStatus')}, ${player.vehicle.getVariable('vehicleDoors')}, ${0});`);  
});


mp.events.add('update_speedometer_gass', () => {

	if(speedo && showed && player.vehicle)
	{ 
		speedo.execute(`setFuel(${player.vehicle.getVariable('vehicleGass')});`);
	} 
});
 
mp.events.add('update_speedometer_km', (countKM) => {

	if(speedo && showed && player.vehicle)
	{  
		speedo.execute(`update_kilometers(${countKM});`);
	} 
});