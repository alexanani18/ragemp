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

//Goto ATM
mp.events.addCommand('gotoatm', (player, id) => {   
    if(player.data.admin < 2) return player.staffPerms(2);
    if(!id) return sendUsage(player, '/gotoatm [atm id]'); 
    if(id > atmPosition.length || id < 1) return sendMessage(player, '009933', 'Invalid atm ID.');
    player.position = new mp.Vector3(atmPosition[id][0], atmPosition[id][1], atmPosition[id][2]);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to atm ${id}.`); 
}); 

//Goto biz
mp.events.addCommand('gotobiz', (player, id) => {
    if(player.data.admin < 2) 
        return player.staffPerms(2);
    if(!id) 
        return sendUsage(player, '/gotobiz [business id]'); 
    if(id > loaded_business_count || id < 1) 
        return sendMessage(player, '009933', 'Invalid business ID.');
    player.position = new mp.Vector3(struct.business[id - 1].bizzX, struct.business[id - 1].bizzY, struct.business[id - 1].bizzZ);
    sendAdmins('ff9900', `(Notice):!{ffffff} ${player.name} teleported to business [${id}].`);
}); 

