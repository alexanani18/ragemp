const driving_spawn = [
    [-487.74, -668.36, 32.21], 
    [-481.85, -668.49, 32.09], 
    [-476.34, -668.52, 31.96] 
];

mp.blips.new(525, new mp.Vector3(-468.88, -678.84, 32.71),{ name: 'Driving school',  color: 45, shortRange: true, dimension: 0});
mp.labels.new('~y~Driving school~n~~w~Usage: /exam', new mp.Vector3(-468.88, -678.84, 32.71), { los: false, font: 4, drawDistance: 10, dimension: 0 });

mp.markers.new(1, new mp.Vector3(-468.88, -678.84, 32.71 - 1.4), 1, { color: [246,205,97, 200], dimension: 0 });

mp.events.addCommand("dmv", (player) => {

    player.position = new mp.Vector3(-468.88, -678.84, 32.71); 
});
 
mp.events.addCommand("exam", (player) => {

    if(!player.IsInRange(-468.88, -678.84, 32.71, 5)) 
        return sendMessage(player, 'ff6633', 'You are not at Driving school.');
    
    if(player.data.InDMV == true || player.data.inQuestions == true) 
        return sendMessage(player, 'ff6633', "You already started this exam.");
    
    if(player.data.drivingLicense > 0) 
        return sendMessage(player, 'ff6633', "You already have driving license.");

    player.data.inQuestions = true; 
 
    player.setVariable('playerQuestionStep', 0);
    player.setVariable('responsesTrue', 0);
    player.setVariable('responsesFalse', 0); 

    player.call('showPlayerQuestion', [0]);  
}); 
    
function startDrivingExam(player)
{   
    player.data.dmvStage = 0;
    player.data.inQuestions = false;
    player.data.InDMV = true;
      
    const spawn = driving_spawn[Math.floor(Math.random() * driving_spawn.length)];
    player.data.schoolVehicle = player.createVehicle(player, 'blista', new mp.Vector3(spawn[0], spawn[1], spawn[2]), [192, 14, 26], [192, 14, 26], -88.26353454589844, 1);
    player.data.schoolVehicle.rotation = new mp.Vector3(-1.1311862468719482, 3.1459245681762695, -88.26353454589844)
 
    player.call('createDMVCheckpoint', [0]);  
    player.call('showDrivingCEF', [player.data.dmvStage]);
  
    sendMessage(player, '00cc66', `Officer:!{ffffff} Hello ${player.name} today i'm going to be your Officer.`);
    sendMessage(player, '00cc66', `Officer:!{ffffff} You passed this exam with !{ff4d4d}${player.getVariable('responsesTrue')}!{ffffff} correct and !{ff4d4d}${player.getVariable('responsesFalse')}!{ffffff} wrong questions.`); 
    sendMessage(player, '00cc66', `Officer:!{ffffff} Start the engine first !{ff4d4d}(press 2 on your keyboard) and GO.`);  
}
 
mp.events.add("onPlayerEnterDMV", (player) => {
    
    if(player.data.InDMV == 1) 
    { 
        player.data.dmvStage ++; 

        switch(player.data.dmvStage)
        {
            case 9:
            { 
                player.data.InDMV = 0; 
                player.data.dmvStage = -1;

                player.data.schoolVehicle.destroy();
                player.data.schoolVehicle = null;
 
                player.call('destroyDMVCheckpoint');  
                player.call('closeDrivingCEF');  
  
                //NOTIFFICATION
                player.call("showNotification", ['Congratulations, you got your driver license.']);
                
                //MYSQL
                player.data.drivingLicense = 50; 
                mysql_action('UPDATE `accounts` SET drivingLicense = ? WHERE username = ? LIMIT 1', [player.data.drivingLicense, player.name]); 
                break;
            }
            default:
            {
                player.call('destroyDMVCheckpoint');
                player.call('createDMVCheckpoint', [player.data.dmvStage]);
                player.call('showDrivingCEF', [player.data.dmvStage]); 
                player.vehicle.repair(); 
                break;
            }
        } 
    }
});   
 
mp.events.add('loadDrivingProcess', (player, process, total_questions, affirmative_responses, negative_response) => {  

    if(process == 0)
        return player.data.inQuestions = false; 

    if(process == 1)
    {
        if(negative_response == 3)
        {
            player.data.inQuestions = false;
            player.call("showNotification", ['You failed this examen.']); 
            return;
        }

        if(affirmative_responses > negative_response && total_questions == 10)
        {
            startDrivingExam(player);  
        } 
    } 
}); 