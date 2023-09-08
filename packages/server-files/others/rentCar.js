var struct = require('../struct.js'); 
require('../mysql.js');
require('../index.js');
 

const rentCarSpawn = [
    [-443.924, -797.486, 30.121, 89.35565185546875], // 1 (vehicle)
    [-443.794, -801.027, 30.120, 90.59622192382812], // 1 (vehicle)
    [-443.659, -804.570, 30.115, 87.6051025390625], // 1 (vehicle)
    [-443.714, -808.401, 30.115, 89.58645629882812], // 1 (vehicle)

];
  
//Loaded from database informations  
gm.mysql.handle.query('SELECT * FROM server_rent_vehicles', [], function (error, results, fields) {
	for(let i = 0; i < results.length; i++) {
 
        struct.rent[i].rentModelID = results[i].rentID;

        struct.rent[i].rentModelName = results[i].rentModel;
        struct.rent[i].rentModelPrice = results[i].rentPrice;
		struct.rent[i].rentModelStock = results[i].rentStock;  
        
        loaded_rent_count ++;
    }
    
    console.log(`[MYSQL] Loaded rent vehicles: ${loaded_rent_count.toString()}`);
});

//Blip, text, etc
mp.markers.new(1, new mp.Vector3(-450.569, -793.829, 30.540 - 1.4), 1,
{
    color: [246,205,97,200],
    dimension: 0
});

mp.blips.new(664, new mp.Vector3(-450.569, -793.829, 30.540), { 
    name: 'Rent vehicles', 
    color: 71, 
    shortRange: true, 
    dimension: 0 
});

mp.labels.new(`~r~Rent vehicle~s~\nUse [~r~/rentcar~s~] to rent a vehicle.`, new mp.Vector3(-450.569, -793.829, 30.540),
{
    los: true,
    font: 4,
    drawDistance: 50,
}); 

//Commands and functions
mp.events.addCommand('rentcar', (player) => {
    let rentString = '';

    if(loaded_rent_count == 0) 
        return sendMessage(player, 'ffffff', "No vehicle is available for rent.");
 
    if(!player.IsInRange(-450.569, -793.829, 30.540, 5)) 
        return sendMessage(player, 'FFFFFF', `You are not at Rent Car place.`);      

    for(let x = 0; x < loaded_rent_count; x++)
    { 
        rentString += `<tr><td>${x + 1}</td><td>${struct.rent[x].rentModelName}</td><td>${player.formatMoney(struct.rent[x].rentModelPrice, 0)}$</td><td>${struct.rent[x].rentModelStock}</td><td><button class="btn btn-success btn-sm" id = "rentAVehicle" onclick = "sendRentInfo(${struct.rent[x].rentModelID});">Rent</button></td> </tr>`; 
    }
 
    player.call("showRentBrowser", [player, rentString]);
});  
 
mp.events.add('playerPressRentButton', (player, type) => {

    const x = (type - 1);
    const spawn = rentCarSpawn[Math.floor(Math.random() * rentCarSpawn.length)];

    if(player.getVariable('vehicleRentedTime') > 0) 
        return sendMessage(player, 'FFFFFF', `You already have a vehicle.`);

    if(player.data.drivingLicense == 0) 
        return sendMessage(player, 'FFFFFF', `You don't have a driving license.`);    

    if(struct.rent[x].rentModelPrice > player.data.money) 
        return sendMessage(player, 'FFFFFF', `You don't have enough money to rent this vehicle.`);
 
    player.setVariable('vehicleRentedTime', (60 * 30)); 
    player.giveMoney(1, struct.rent[x].rentModelPrice);
  
    player.data.rentedVehicle = player.createVehicle(player, struct.rent[x].rentModelName, new mp.Vector3(spawn[0], spawn[1], spawn[2]), generateRGB(), generateRGB(), spawn[3], 1);
  
    player.call("closePlayerRentBrowser");
 
    struct.rent[x].rentModelStock = struct.rent[x].rentModelStock - parseInt(1); 
    mysql_action('UPDATE `server_rent_vehicles` SET rentStock = ? WHERE rentID = ? LIMIT 1', [struct.rent[x].rentModelStock, struct.rent[x].rentModelID]); 

	sendMessage(player, 'FFFFFF', `------------------!{ff4d4d}(Rent vehicle):!{ffffff}----------------`);
	sendMessage(player, 'FFFFFF', `Vehicle rented this !{ff4d4d}${struct.rent[x].rentModelName}!{ffffff} for !{ff4d4d}${player.formatMoney(struct.rent[x].rentModelPrice, 0)}!{ffffff}$`); 
    sendMessage(player, 'FFFFFF', `This vehicle is available for !{ff4d4d}30:00!{ffffff} minutes.`); 
    sendMessage(player, 'FFFFFF', `------------------------------------------------------`);   
});


mp.events.add("timerRentVehicle", (player) => {

    const last = player.getVariable('vehicleRentedTime'); 
    player.setVariable('vehicleRentedTime', (last - 1));
 
    switch(player.getVariable('vehicleRentedTime'))
    {
        case 0:
        {
            player.data.rentedVehicle.destroy();

            sendMessage(player, 'ff4d4d', `(Rent timer):!{ffffff} Your vehicle has been despawned because time expired.`);
            break;
        }
        case 300: 
        {
            sendMessage(player, 'ff4d4d', `(Rent timer):!{ffffff} Your vehicle has been despawned in ${Calculate(player.getVariable('vehicleRentedTime'))}.`);
            break;
        }
    } 
});
 
mp.events.addCommand('unrentcar', (player) => {

    if(player.getVariable('vehicleRentedTime') == 0) 
        return sendMessage(player, 'ffffff', 'You not rented a vehicle.');

    player.setVariable('vehicleRentedTime', -1);
    player.data.rentedVehicle.destroy();    
    sendMessage(player, 'ff4d4d', `(Rent vehicle):!{ffffff} You unrented this vehicle.`); 
});