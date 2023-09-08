
let notifiBrowser = null;

mp.events.add('showNotification', (text) => {
  
    if(notifiBrowser == null) notifiBrowser = mp.browsers.new(`package://CEF/notifications/structure.html`);

    notifiBrowser.execute("createNotification('" + text + "');");  
    return;
});  