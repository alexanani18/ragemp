let drivingBrowser = null; 
let infoBrowser = null;
let teoreticBrowser = null;

//---------------------------------------------------------------------------- [ TEORETIC TEST ] ----------------------------------------------------------------------------//
mp.events.add('showDrivingCEF', (count) => {

    if(drivingBrowser == null) drivingBrowser = mp.browsers.new("package://CEF/driving-school/info-traseu.html");
     
    drivingBrowser.execute(`setProgressBar(${count * 10});`);
}); 

mp.events.add('closeDrivingCEF', () => {

    if(drivingBrowser != null) {
        drivingBrowser.destroy();
        drivingBrowser = null; 
    } 
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------//


//---------------------------------------------------------------------------- [ TEORETIC TEST ] --------------------------------------------------------------------------//
function clickDrivingQuestion(option, total_questions, affirmative_responses, negative_response)
{      
    mp.trigger("loadDrivingResponse", option, total_questions, affirmative_responses, negative_response);
}  

mp.events.add("loadDrivingResponse", (option, total_questions, affirmative_responses, negative_response) => { 


    switch(option)
    {
        //CLOSE DMV INFORMATIONS AND START EXAMEN
        case -1:
        {
            mp.events.call("showPlayerQuestion", 1);  
            break;
        }

        //CLOSE TEORETIC BROWSER
        case 0:
        {
            if(teoreticBrowser != null) 
            {
                teoreticBrowser.destroy();
                teoreticBrowser = null; 
        
                mp.gui.cursor.visible = false; 
            } 
            break;
        }

        //RECEIVED AND SEND NEW QUESTION
        case 1:
        {
            if(total_questions == 10 || negative_response == 3)
            {
                teoreticBrowser.destroy();
                teoreticBrowser = null; 

                mp.gui.cursor.visible = false;   
            }
            break;
        }
    } 

    mp.events.callRemote("loadDrivingProcess", option, total_questions, affirmative_responses, negative_response);  
});    
 
mp.events.add('showPlayerQuestion', (option) => {


    if(option == 0)
    {
        if(infoBrowser == null) 
        {
            infoBrowser = mp.browsers.new("package://CEF/driving-school/examenInfo.html");
        }
    }
    else 
    {
        if(infoBrowser != null)
        {
            infoBrowser.destroy();
            infoBrowser = null;
        }

        if(teoreticBrowser == null) 
        {
            teoreticBrowser = mp.browsers.new("package://CEF/driving-school/index.html"); 
        }
    } 
    mp.gui.cursor.visible = true; 
}); 
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------//




//---------------------------------------------------------------------------- [ PRACTIC TEST ] ----------------------------------------------------------------------------// 
var dmvblip = null;
var dmvcheckpoint = null; 
const dmv_route = [
    [-426.13, -666.19, 28.40, 253.323],
    [-242.82, -676.04, 28.07, 253.323],
    [-249.65, -745.98, 28.89, 253.323],
    [-281.49, -832.87, 28.50, 253.323],
    [-476.15, -829.99, 28.27, 253.323],
    [-492.60, -802.31, 28.42, 253.323],
    [-540.18, -688.82, 28.03, 253.323],
    [-513.92, -666.11, 28.99, 253.323],
    [-462.95, -666.41, 28.12, 253.323] 
];
  
mp.events.add('createDMVCheckpoint', (c) => {
    dmvcheckpoint = mp.checkpoints.new(c == dmv_route.length - 1 ? 4 : 1, new mp.Vector3(dmv_route[c][0], dmv_route[c][1], dmv_route[c][2]), 5,
    {
        direction: c != dmv_route.length - 1 ? new mp.Vector3(dmv_route[c + 1][0], dmv_route[c + 1][1], dmv_route[c + 1][2]) : null,
        color: [206, 47, 47, 255],
        visible: true,
        dimension: 0
    });

    dmvblip = mp.blips.new(1, new mp.Vector3(dmv_route[c][0], dmv_route[c][1], dmv_route[c][2]),
    {
        name: 'Checkpoint for DMV',
        scale: 1,
        color: 1,
        alpha: 255,
        shortRange: false,
        dimension: 0,
    });

    dmvblip.setRoute(true); 
});
  
mp.events.add('destroyDMVCheckpoint', () => {
    dmvcheckpoint.destroy();
    dmvblip.setRoute(false);
    dmvblip.destroy(); 

    dmvcheckpoint = null; 
});
 
mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if(checkpoint == dmvcheckpoint) 
    {
        mp.events.callRemote("onPlayerEnterDMV");
    }
});   