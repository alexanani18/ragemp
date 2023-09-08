require("../functions.js");
require("../auth.js"); 

//Reports sistem
mp.events.addCommand('report', (player) => { 
    player.call("showReportSend", []);
});

mp.events.addCommand('reports', (player) => { 
    if(player.data.admin < 1) 
        return player.staffPerms(1);
    loadReports(player);
});
 
mp.events.add("sendReportInfo", (player, button, reportPlayer, reportDetails, reportPriority) => {
    if(button == 1)
    {
        const reportedID = getNameOnNameID(reportPlayer);
        //Veriffications
        if(player.data.haveReport == true)
            return player.call("showNotification", [`You already have a report.`]);
        if(reportedID == undefined)
            return player.call("showNotification", [`This player is not connected.`]);
        if(reportPriority == 0)
            return player.call("showNotification", [`Select report priority.`]);
        //Update CEF
        adminsUpdateCef();
        //Close player CEF
        player.call("destroySendReport", []);
        player.setVariable('playerMenuOpen', false);
        //Set variables
        player.data.haveReport = true;
        player.data.reportDetails = reportDetails;
        player.data.reportPriority = reportPriority;
        player.data.reportDate = getDates();
        player.data.reportTo = reportedID;
        player.data.reportStaus = 'waiting';
        player.data.reportAccesedBy = 'none';
        //Colors
        var color = "!{ffcc00}";      
        if(reportPriority == "medium") color = "!{009933}";
        if(reportPriority == "high") color = "!{ff4d4d}";
        //Send messages
        sendMessage(player, COLOR_RED, `(Report):!{ffffff} Your report has been sent. Please wait until an administrator respond.`); 
        sendMessage(player, COLOR_RED, `(Report):!{ffffff} Report description: ${reportDetails} (priority: ${color}${reportPriority}!{ffffff}).`);  
    } 
});

mp.events.add("sendReportPackage", (player, button, playerID, closeReason) => {
    const reportedID = getNameOnNameID(playerID);
    switch(button)
    {
        case 0: break;
        //Button for show more
        case 1:
        {  
            player.call("showMoreModal", [0, reportedID.data.reportDetails]);
            break;
        }
        //Button for open/close
        case 2:
        {  
            //If report is already opened and click report is closed.
            if(reportedID.data.reportStaus == 'opened')
            {  
                //Veriffication
                if(reportedID.data.reportAccesedBy != player.name)
                    return player.call("showNotification", [`This report is already taken by someone.`]);
                //Execute reason modal
                player.call("showMoreModal", [2, `<button type = "button" class = "btn btn-outline-success btn-block btn-sm" onclick = "clickReport(5, ${reportedID.id});">Send reason <i class = "fa fa-check" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-danger btn-block btn-sm" class = "close" data-dismiss = "modal" aria-label = "Close">Close <i class = "fa fa-close" aria-hidden = "true"></i></button>`]); 
            }
            else 
            {
                //Veriffication
                if(reportedID.data.reportStaus == 'opened')
                    return player.call("showNotification", [`This report is already taken by someone.`]);
                //Update variables
                reportedID.data.reportStaus = 'opened'; 
                reportedID.data.reportAccesedBy = player.name
                //Update CEF browser
                adminsUpdateCef();  
                //Send notiffications
                player.call("showNotification", [`This report is now <a style = 'color:#00b33c;'>opened<a> <i class = "fa fa-check" aria-hidden = "true"></i>`]);
            } 
            break;
        }
        //Show teleport modal
        case 3:
        {   
            //Veriffication
            if(reportedID.data.reportStaus == 'opened' && reportedID.data.reportAccesedBy != player.name)
                return player.call("showNotification", [`This report is already taken by someone.`]);
            player.call("showMoreModal", [1, `<button type = "button" class = "btn btn-outline-success btn-sm" onclick = "clickReport(4, ${reportedID.id});">Teleport to ${reportedID.name} <i class = "fa fa-map-marker" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-danger btn-sm" class = "close" data-dismiss = "modal" aria-label = "Close">Close <i class = "fa fa-close" aria-hidden = "true"></i></button> <button type = "button" class = "btn btn-outline-warning btn-sm" onclick = "clickReport(4, ${playerID});">Teleport to ${reportedID.data.reportTo.name} <i class = "fa fa-map-marker" aria-hidden = "true"></i></button>`]);
            break;
        } 
        //Teleport player
        case 4:
        { 
            //Veriffication
            if(reportedID.data.reportStaus == 'opened' && reportedID.data.reportAccesedBy != player.name)
                return player.call("showNotification", [`This report is already taken by someone.`]);
            player.position = new mp.Vector3(reportedID.position.x, reportedID.position.y, reportedID.position.z + 1); 
            sendMessage(player, `00cc99`, `(R Teleport):!{ffffff} You teleported to ${reportedID.name}...`); 
            break;
        }
        //Close report with reason
        case 5:
        { 
            //Reset variables
            reportedID.data.haveReport = false;
            reportedID.data.reportAccesedBy = 'none';
            reportedID.data.reportStaus = 'closed';
            //Update CEF browser
            adminsUpdateCef(); 
            //Messages
            sendMessage(reportedID, COLOR_RED, `(Report):!{ffffff} Admin ${player.name} [${player.id}] respond on your report.`); 
            sendMessage(reportedID, COLOR_RED, `(Report):!{ffffff} Response: ${closeReason}.`); 
            sendAdmins(COLOR_RED, `(Report):!{ffffff} ${player.name} [${player.id}] close ${reportedID.name}'s [${reportedID.id}] report.`);
            sendAdmins(COLOR_RED, `(Report):!{ffffff} Reason: ${closeReason}.`); 
            break; 
        }
    } 
});

function loadReports(player)
{
    player.setVariable('playerMenuOpen', true);
    let textBadge = ``;
    let reportsText = ``;
    let totalReports = 0;
    mp.players.forEach(players => {
        if(players.loggedInAs == true && players.data.haveReport == true)
        { 
            let textSlice = players.data.reportDetails.slice(0, 15);
            totalReports ++;
            switch(players.data.reportPriority)
            { 
                case "low": textBadge = '<span class = "badge badge-pill badge-warning">low</span>'; break;
                case "medium": textBadge = '<span class = "badge badge-pill badge-success">medium</span>'; break;
                case "high": textBadge = '<span class = "badge badge-pill badge-danger">high</span>'; break;
            }
            reportsText += `<tr><td>${players.name}</td><td>${players.data.reportTo.name}</td><td>${players.data.reportDate}</td><td>${textSlice}...<br><a href = "#" onclick = "clickReport(1, ${players.id});">view more <i class="fa fa-caret-down" aria-hidden="true"></i></a></td><td>${textBadge}</td><td>${players.data.reportStaus == 'waiting' ? ('<span class="badge badge-pill badge-warning">in waiting</span>') : (`<span class="badge badge-pill badge-success">opened by ${players.data.reportAccesedBy}</span>`)}</td><td><button type = "button" class="btn btn-outline-info btn-sm" onclick = "clickReport(3, ${players.id});">Teleport <i class = "fa fa-map-marker" aria-hidden = "true"></i></button> ${players.data.reportStaus == 'waiting' ? (`<button type = "button" class="btn btn-outline-success btn-sm" onclick = "clickReport(2, ${players.id});">Open <i class = "fa fa-check" aria-hidden="true"></i></button>`) : (`<button type = "button" class="btn btn-outline-danger btn-sm" onclick = "clickReport(2, ${players.id});">Close <i class = "fa fa-times" aria-hidden="true"></i></button>`)}</td></tr>`;
        } 
 
        player.call("showTotalReports", [reportsText, totalReports]);
    });   
}

function adminsUpdateCef()
{
    mp.players.forEach(admins => {
        if(admins.loggedInAs == true && admins.data.admin > 0 && admins.getVariable('playerMenuOpen') == true)
        {
            loadReports(admins);  
        } 
    }); 
} 