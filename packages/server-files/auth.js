module.exports =
{  
    registerAccount: function(player){
 
        player.position = new mp.Vector3(-1041.147, -2744.269, 21.359); //Use the same values that are default inside your DB
        player.heading = 327.559;
        player.health = 100;
        player.armour = 0;

        //Grades
        player.data.admin  = 0;
        player.data.helper = 0;
   
        //Level
        player.data.level = parseInt(1); 

        //Money
        player.data.money = parseInt(5000);
        player.data.moneyBank = parseInt(5000);
 
        //Level
        player.data.level = 1;
        player.data.experience = 0;
        player.data.needExperience = 300;
        player.data.hours = 0;

        //Premium
        player.data.playerPremium = 0;
        player.data.premiumPoints = 0;
 
        //House si business si job
        player.data.job = -1;
        player.data.house = -1;
        player.data.business = 999;
 
        player.data.drivingLicense = 0;
        player.data.playerWarns = 0;
 
        //Group
        player.data.playerGroup = -1; 
        player.data.playerGroupRank = 0;
        player.data.playerGroupFP = 0;
        player.data.playerGroupWarns = 0;
        player.data.playerGroupDays = 0;

        //Wanted
        player.data.playerWanted = 0;
        player.data.playerWantedTime = 0;
        player.data.playerWantedCrimes = '';
        player.data.playerCrimesTime = '';
        player.data.playerCrimeCaller = '';
 
        //Hunger | Thirst
        player.data.thirst = 100;
        player.data.hunger = 100;

        //Slots vehicle
        player.data.totalSlots = 2;
        player.data.totalVehicles = 0;
        player.data.totalVehSpawned = 0;

        //Last connect
        player.data.lastOnline = 'none';

        //Player phone
        player.data.playerPhone = 0;

        //Spawn change
        player.data.spawnChange = 0;

        //Hud status
        player.data.hudStatus = true;

        //last location
        player.data.lastSpawnX = -1041.147;
        player.data.lastSpawnY = -2744.269;
        player.data.lastSpawnZ = 21.359;
        player.data.lastSpawnA = 327.559;
  
        //Muted sistem
        player.data.mute = 0;
 
        //Player variables
        player.setVariable('playerLogged', true); 
        player.setVariable('playerTabOpened', 0);  
        player.setVariable('vehicleRentedTime', -1); 
        player.setVariable('playerDuty', 0);
        player.setVariable('playerCuffed', false);
     
        player.loggedInAs = true;   
 
        player.sendLoginRegMessage(player, 1);

        mysql_action('UPDATE `accounts` SET status = ?, playerLastOnline = ? WHERE username = ?', [1, getDates(), player.name]);
    },
    
    saveAccount: function(player){
        gm.mysql.handle.query('UPDATE `accounts` SET money = ?, status = ?, lastSpawnX = ?, lastSpawnY = ?, lastSpawnZ = ?, lastSpawnA = ? WHERE username = ?', [player.data.money, (player.loggedInAs == true) ? (0) : (1), player.position.x, player.position.y, player.position.z, player.heading, player.name], function(err, res, row){
            if(err) 
                return console.log(err);
        });
    },
  
    loadAccount: function(player){ 
        gm.mysql.handle.query('SELECT * FROM `accounts` WHERE username = ?', [player.name], function(err, res, row){
            if(err) console.log(err);
            if(res.length){ 
                res.forEach(function(playerData) {
   
                    player.health = 100; 
                    player.loggedInAs = true;   
                    player.name = playerData.username;
                    player.data.name = playerData.username;

                    player.data.sqlid = playerData.id;

                    //Money
                    player.data.money = playerData.money;
                    player.data.moneyBank = playerData.moneyBank;
                     
                    //Grades
                    player.data.helper = playerData.helper;
                    player.data.admin = playerData.admin;
  
                    //Level
                    player.data.level = playerData.level;
                    player.data.experience = playerData.experience;
                    player.data.needExperience = playerData.needExperience;
                    player.data.hours = playerData.hours;
 
                    player.data.playerPremium = playerData.playerPremium;
                    player.data.premiumPoints = playerData.premiumPoints;

                    player.data.playerWarns = playerData.playerWarns;

                    //Job
                    player.data.job = playerData.job;
                    player.data.plantCollected = 0;

                    //House si business 
                    player.data.house = playerData.house; //Aici daca are rent sau casa personala
                    player.data.business = playerData.business; //Aici daca are business

                    //Muted sistem
                    player.data.mute = playerData.mute;

                    //Licenses
                    player.data.drivingLicense = playerData.drivingLicense;

                    //Check player spawnchange
                    player.data.spawnChange = playerData.spawnChange;
 
                    //Check player group
                    player.data.playerGroup = playerData.playerGroup; 
                    player.data.playerGroupRank = playerData.playerGroupRank;
                    player.data.playerGroupFP = playerData.playerGroupFP;
                    player.data.playerGroupWarns = playerData.playerGroupWarns;
                    player.data.playerGroupDays = playerData.playerGroupDays;
 
                    //Player wanteds
                    player.data.playerWanted = playerData.wanted;
                    player.data.playerWantedTime = playerData.wantedTime;
                    player.data.playerWantedCrimes = playerData.wantedCrimes;
                    player.data.playerCrimesTime = playerData.wantedCrimeTime;
                    player.data.playerCrimeCaller = playerData.wantedCaller;

                    //Crimes and arrests
                    player.data.playerCrimes = playerData.playerCrimes;
                    player.data.playerArrests = playerData.playerArrests;
 
                    //Food water
                    player.data.thirst = playerData.water;
                    player.data.hunger = playerData.food;
 
                    //Check sex
                    player.data.sex = playerData.sex;
                    player.data.skin = playerData.modelPlayer;
                     
                    //Slots vehicle
                    player.data.totalSlots = playerData.vehicleSlots;
                    player.data.totalVehicles = playerData.totalVehs;

                    //Last connect
                    player.data.lastOnline = playerData.playerLastOnline;
 
                    //Last spawn position
                    player.data.lastSpawnX = playerData.lastSpawnX;
                    player.data.lastSpawnY = playerData.lastSpawnY;
                    player.data.lastSpawnZ = playerData.lastSpawnZ;
                    player.data.lastSpawnA = playerData.lastSpawnA;
  
                    //Player phone
                    player.data.playerPhone = playerData.phoneNumber;

                    //Hud
                    player.data.hudStatus = playerData.hudStatus;

                    //Toggle
                    player.data.helperChat = playerData.helperChat;
                    player.data.groupChat = playerData.groupChat;
 
                    //Player variables
                    player.setVariable('playerLogged', true); 

                    player.setVariable('playerTabOpened', 0);  
                    player.setVariable('vehicleRentedTime', 0);
                    player.setVariable('playerDuty', 0);
                    player.setVariable('playerCuffed', false);
   
                    mysql_action('UPDATE `accounts` SET status = ?, playerLastOnline = ? WHERE username = ?', [1, getDates(), player.name]);

                    //Load players vehicle
                    mp.events.call("loadPlayerVehicles", player, player.data.sqlid);
                    
                    //Load inventory
                    mp.events.call("loadPlayerInventory", player, player.data.sqlid);
 
                    player.sendLoginRegMessage(player, 0);
                });
            }
        });
        console.log(`${player.name} has logged in`);    
    } 
}