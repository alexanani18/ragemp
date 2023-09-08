mp.events.add("add_voice_listener", (player, target) =>
{
	if(target)
	{
		player.enableVoiceTo(target);
	}
});

mp.events.add("remove_voice_listener", (player, target) =>
{
	if(target)
	{
		player.disableVoiceTo(target);
	}
}); 

mp.events.add("modifiMicro", (player, status) =>
{ 
	player.setVariable('playerMicrophone', (player.getVariable('playerMicrophone') == true ? (false) : (true)));   
	player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]); 
}); 