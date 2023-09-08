let viewReportsBrowser = null;
let sendReportsBrowser = null;

//Send reports 
function clickSendReport(button, reportPriority)
{  
    let reportPlayer  = document.getElementById("reportPlayer"); 
    let reportDetails = document.getElementById("reportReason"); 
 
    mp.trigger("onSendReport", button, reportPlayer.value, reportDetails.value, reportPriority); 
}

mp.events.add("showReportSend", () =>
{
    if(sendReportsBrowser == null)
    {
        sendReportsBrowser = mp.browsers.new("package://CEF/reportsSistem/sendReports.html");   
        mp.gui.cursor.visible = true;
    }  
});

mp.events.add("onSendReport", (button, reportPlayer, reportDetails, reportPriority) => { 
 
    switch(button)
    {
        case 0: 
        {  
            mp.events.call("destroySendReport"); 
            break;
        }   
    } 

    //Send info in server side
    mp.events.callRemote("sendReportInfo", button, reportPlayer, reportDetails, reportPriority);	
}); 
 
mp.events.add("destroySendReport", () =>
{ 
    if(sendReportsBrowser != null)
    {
        sendReportsBrowser.destroy();
        sendReportsBrowser = null;

        mp.gui.cursor.visible = false;
    } 
});
 
//View reports
mp.keys.bind(0x45, true, function() {
 
    if(isChatActive() == false) mp.events.call("showPlayerReports");	
});

mp.events.add("showTotalReports", (text, reportsTotal) =>
{
    if(viewReportsBrowser == null)
    {
        viewReportsBrowser = mp.browsers.new("package://CEF/reportsSistem/viewReports.html");   
        mp.gui.cursor.visible = true;
    }  

    if(viewReportsBrowser != null)
    {
        viewReportsBrowser.execute(`document.getElementById('playerTickets-placeholder').innerHTML = '${text}'`); 

        viewReportsBrowser.execute(`document.getElementById('infoTickets-placeholder').innerHTML = 'In this moment is <a style = "color:#ff4d4d">${reportsTotal}</a> <i class="fa fa-ticket" aria-hidden="true"></i> reports in waiting.'`); 
    }
});


function clickReport(button, playerID)
{  
    let closeReason = document.getElementById("reportCloseReason");  
 
    //Close reason report modal
    if(button == 5)
    {
        $('#close_report').modal('hide');
    }
 
    mp.trigger("onClickReport", button, playerID, closeReason.value); 
}

mp.events.add("onClickReport", (button, playerID, closeReason) => { 
 
    mp.events.callRemote("sendReportPackage", button, playerID, closeReason);
    switch(button)
    {
        case 0: 
        {
            //View reports
            if(viewReportsBrowser != null)
            {
                viewReportsBrowser.destroy();
                viewReportsBrowser = null;

                mp.gui.cursor.visible = false;
            } 
            break;
        }   
    } 
}); 
 
//Function for button 'show more' and teleport to
mp.events.add("showMoreModal", (id, text) => { 

    if(viewReportsBrowser != null)
    { 
        viewReportsBrowser.execute("showMoreModalText('" + id + "', '" + text + "');"); 
    } 
}); 