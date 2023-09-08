require("../functions.js");
require("../auth.js"); 
 
//Car color change
mp.events.addCommand("carcolor", (player, _, veh, colorOne, colorTwo) => {
    const vehicle = mp.vehicles.at(veh); 
    if(player.data.admin < 2) 
        return player.staffPerms(2);
    if(!veh || !colorOne || !colorTwo)
        return sendUsage(player, `/carcolor [vehicle_id] [color_one] [color_two]`);
    if(vehicle == undefined)
        return player.outputChatBox(`This vehicle doesn't exist.`);
    vehicle.setColor(parseInt(colorOne), parseInt(colorTwo));
});

//Goto xyz
mp.events.addCommand("gotoxyz", (player, x, _, y, z) => { 
    if(player.data.admin < 2) 
        return player.staffPerms(2);
    if(!x || !y || !z) 
        return sendUsage(player, `/gotoxyz [x] [y] [z]`); 
    ((!player.vehicle) ? player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)) : player.vehicle.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)));
    sendMessage(player, COLOR_ADMIN, `You teleported to position: ${parseFloat(x)}, ${parseFloat(y)}, ${parseFloat(z)}`);
});

//Goto DS
mp.events.addCommand('gotods', (player) => {
    if(player.data.admin < 2)
        return player.staffPerms(2);
    player.position = new mp.Vector3(-57.110, -1096.947, 26.422);
}); 