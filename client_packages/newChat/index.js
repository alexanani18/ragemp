mp.gui.chat.show(false); //Disables default RageMP Chat 
const chatbox = mp.browsers.new('package://newChat/chatUI/index.html');

chatbox.markAsChat();

mp.events.add('ToggleChatBoxActive', (toggle) => {
    chatbox.execute(`chatAPI.activate(${toggle});`); 
});
 
mp.events.add('ClearChatBox', () => {
    chatbox.execute('chatAPI.clear();');
});

mp.events.add('SetCurrentMenuId', (menuId) => {
    chatbox.execute(`chatAPI.activate(${menuId === 0});`);
});

//Disable chat
mp.events.call("ToggleChatBoxActive", false);  

mp.events.add("ToggleChat", (option, status, chatNormal) => { 
  
    if(option == 0) 
        mp.gui.cursor.visible = status;   

    mp.events.callRemote("togglePlayerChat", status, chatNormal);	  
}); 

isChatActive = function() 
{ 
	return mp.players.local.getVariable('statusChat');
}