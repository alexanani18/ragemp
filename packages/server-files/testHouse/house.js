const coord = [[113.40, -628.18, 44.22]];

mp.markers.new(1, new mp.Vector3(113.40, -628.18, 44.22), 1, { color: [246,205,97, 200], dimension: 0 });

//test
mp.events.addCommand('testlocation', (player) => {
    if(player.data.admin < 7)
        return player.staffPerms(7);
    
    player.position = new mp.Vector3(113.40, -628.18, 44.22);
}); 