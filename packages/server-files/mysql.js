const mysql  = require('mysql');
const bcrypt = require('bcrypt-nodejs'); 
const struct = require('./struct.js');

//DATE
const month = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"]; 
var date = new Date();
var hour = date.getHours();
var min = date.getMinutes(); 

const weaponsData = ["weapon_dagger", "weapon_bat", "weapon_bottle", "weapon_crowbar", "weapon_unarmed", "weapon_flashlight", "weapon_golfclub", "weapon_hammer", "weapon_hatchet", "weapon_knuckle", "weapon_knife", "weapon_machete", "weapon_switchblade", "weapon_nightstick", "weapon_wrench", "weapon_battleaxe", "weapon_poolcue", "weapon_stone_hatchet", "weapon_pistol", "weapon_pistol_mk2", "weapon_combatpistol", "weapon_appistol", "weapon_stungun", "weapon_pistol50", "weapon_snspistol", "weapon_snspistol_mk2", "weapon_heavypistol", "weapon_vintagepistol", "weapon_flaregun", "weapon_marksmanpistol", "weapon_revolver", "weapon_revolver_mk2", "weapon_doubleaction", "weapon_raypistol", "weapon_microsmg", "weapon_smg", "weapon_smg_mk2", "weapon_assaultsmg", "weapon_combatpdw", "weapon_machinepistol", "weapon_minismg", "weapon_raycarbine", "weapon_pumpshotgun", "weapon_pumpshotgun_mk2", "weapon_sawnoffshotgun", "weapon_assaultshotgun", "weapon_bullpupshotgun", "weapon_musket", "weapon_heavyshotgun", "weapon_dbshotgun", "weapon_autoshotgun", "weapon_assaultrifle", "weapon_assaultrifle_mk2", "weapon_carbinerifle", "weapon_carbinerifle_mk2", "weapon_advancedrifle", "weapon_specialcarbine", "weapon_specialcarbine_mk2", "weapon_bullpuprifle", "weapon_bullpuprifle_mk2", "weapon_compactrifle", "weapon_mg", "weapon_combatmg", "weapon_combatmg_mk2", "weapon_gusenberg", "weapon_sniperrifle", "weapon_heavysniper", "weapon_heavysniper_mk2", "weapon_marksmanrifle", "weapon_marksmanrifle_mk2", "weapon_rpg", "weapon_grenadelauncher", "weapon_grenadelauncher_smoke", "weapon_minigun", "weapon_firework", "weapon_railgun", "weapon_hominglauncher", "weapon_compactlauncher", "weapon_rayminigun", "weapon_grenade", "weapon_bzgas", "weapon_molotov", "weapon_stickybomb", "weapon_proxmine", "weapon_snowball", "weapon_pipebomb", "weapon_ball", "weapon_smokegrenade", "weapon_flare", "weapon_petrolcan", "gadget_parachute", "weapon_fireextinguisher"];
const vehiclesData = ["impaler3", "monster4", "monster5", "slamvan6", "issi6", "cerberus2", "cerberus3", "deathbike2", "dominator6", "deathbike3", "impaler4", "slamvan4", "slamvan5", "brutus", "brutus2", "brutus3", "deathbike", "dominator4", "dominator5", "bruiser", "bruiser2", "bruiser3", "rcbandito", "italigto", "cerberus", "impaler2", "monster3", "tulip", "scarab", "scarab2", "scarab3", "issi4", "issi5", "clique", "deveste", "vamos", "imperator", "imperator2", "imperator3", "toros", "deviant", "schlagen", "impaler", "zr380", "zr3802", "zr3803", "dinghy", "dinghy2", "dinghy3", "dinghy4", "jetmax", "marquis", "seashark", "seashark2", "seashark3", "speeder", "speeder2", "squalo", "submersible", "submersible2", "suntrap", "toro", "toro2", "tropic", "tropic2", "tug", "benson", "biff", "hauler", "hauler2", "mule", "mule2", "mule3", "mule4", "packer", "phantom", "phantom2", "phantom3", "pounder", "pounder2", "stockade", "stockade3", "terbyte", "blista", "brioso", "dilettante", "dilettante2", "issi2", "panto", "prairie", "rhapsody", "cogcabrio", "exemplar", "f620", "felon", "felon2", "jackal", "oracle", "oracle2", "sentinel", "sentinel2", "windsor", "windsor2", "zion", "zion2", "bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3", "ambulance", "fbi", "fbi2", "firetruk", "lguard", "pbus", "police", "police2", "police3", "police4", "policeb", "polmav", "policeold1", "policeold2", "policet", "pranger", "predator", "riot", "riot2", "sheriff", "sheriff2", "akula", "annihilator", "buzzard", "buzzard2", "cargobob", "cargobob2", "cargobob3", "cargobob4", "frogger", "frogger2", "havok", "hunter", "maverick", "savage", "skylift", "supervolito", "supervolito2", "swift", "swift2", "valkyrie", "valkyrie2", "volatus", "bulldozer", "cutter", "dump", "flatbed", "guardian", "handler", "mixer", "mixer2", "rubble", "tiptruck", "tiptruck2", "apc", "barracks", "barracks2", "barracks3", "barrage", "chernobog", "crusader", "halftrack", "khanjali", "rhino", "thruster", "trailersmall2", "akuma", "avarus", "bagger", "bati", "bati2", "bf400", "carbonrs", "chimera", "cliffhanger", "daemon", "daemon2", "defiler", "diablous", "diablous2", "double", "enduro", "esskey", "faggio", "faggio2", "faggio3", "fcr", "fcr2", "gargoyle", "hakuchou", "hakuchou2", "hexer", "innovation", "lectro", "manchez", "nemesis", "nightblade", "oppressor", "oppressor2", "pcj", "ratbike", "ruffian", "sanchez2", "sanctus", "shotaro", "sovereign", "thrust", "vader", "vindicator", "vortex", "wolfsbane", "zombiea", "zombieb", "blade", "buccaneer", "buccaneer2", "chino", "chino2", "coquette3", "dominator", "dominator2", "dukes", "dukes2", "faction", "faction2", "faction3", "gauntlet", "gauntlet2", "hermes", "hotknife", "lurcher", "moonbeam", "moonbeam2", "nightshade", "pheonix", "picador", "ratloader", "ratloader2", "ruiner", "ruiner2", "ruiner3", "sabregt", "sabregt2", "slamvan", "slamvan2", "slamvan3", "stalion", "stalion2", "tampa", "tampa3", "vigero", "virgo", "virgo2", "virgo3", "voodoo", "voodoo2", "yosemite", "bfinjection", "bifta", "blazer", "blazer2", "blazer3", "blazer4", "blazer5", "bodhi2", "brawler", "dloader", "dubsta3", "dune", "dune2", "dune3", "dune4", "dune5", "freecrawler", "insurgent", "insurgent2", "insurgent3", "kalahari", "marshall", "mesa3", "monster", "menacer", "nightshark", "rancherxl", "rancherxl2", "rebel", "rebel2", "riata", "sandking", "sandking2", "technical", "technical2", "technical3", "trophytruck", "trophytruck2", "alphaz1", "avenger", "besra", "blimp", "blimp2", "blimp3", "bombushka", "cargoplane", "cuban800", "dodo", "duster", "howard", "hydra", "jet", "lazer", "luxor", "luxor2", "mammatus", "microlight", "miljet", "mogul", "molotok", "nimbus", "nokota", "pyro", "rogue", "seabreeze", "shamal", "starling", "strikeforce", "stunt", "titan", "tula", "velum", "velum2", "vestra", "volatol", "baller", "baller2", "baller3", "baller4", "baller5", "baller6", "bjxl", "cavalcade", "cavalcade2", "contender", "dubsta", "dubsta2", "fq2", "granger", "gresley", "habanero", "huntley", "landstalker", "mesa", "mesa2", "patriot", "patriot2", "radi", "rocoto", "seminole", "serrano", "xls", "xls2", "asea", "asea2", "asterope", "cog55", "cog552", "cognoscenti", "cognoscenti2", "emperor", "emperor2", "emperor3", "fugitive", "glendale", "ingot", "intruder", "limo2", "premier", "primo", "primo2", "regina", "romero", "schafter2", "schafter5", "schafter6", "stafford", "stanier", "stratum", "stretch", "superd", "surge", "tailgater", "warrener", "washington", "airbus", "brickade", "bus", "coach", "pbus2", "rallytruck", "rentalbus", "taxi", "tourbus", "trash", "trash2", "wastelander", "alpha", "banshee", "bestiagts", "blista2", "blista3", "buffalo", "buffalo2", "buffalo3", "carbonizzare", "comet2", "comet3", "comet4", "coquette", "elegy", "elegy2", "feltzer2", "furoregt", "fusilade", "futo", "jester", "jester2", "khamelion", "kuruma", "kuruma2", "lynx2", "massacro", "massacro2", "neon", "ninef", "ninef2", "omnis", "pariah", "penumbra", "raiden", "rapidgt", "rapidgt2", "raptor", "revolter", "ruston", "schafter3", "schafter4", "schwarzer", "sentinel3", "seven70", "specter", "specter2", "streiter", "sultan", "surano", "tampa2", "tropos", "verlierer2", "ardent", "btype", "btype2", "btype3", "casco", "cheetah2", "coquette2", "deluxo", "feltzer3", "gt500", "infernus2", "jb700", "mamba", "manana", "monroe", "peyote", "pigalle", "rapidgt3", "retinue", "savestra", "stinger", "stingergt", "stromberg", "swinger", "torero", "tornado", "tornado2", "tornado3", "tornado4", "tornado5", "tornado6", "turismo2", "viseris", "ztype", "adder", "autarch", "banshee2", "bullet", "cheetah", "cyclone", "entityxf", "fmj", "gp1", "infernus", "italigtb", "italigtb2", "le7b", "nero", "nero2", "osiris", "penetrator", "pfister811", "prototipo", "reaper", "sc1", "scramjet", "sheava", "sultanrs", "t20", "tempesta", "turismor", "tyrus", "vacca", "vagner", "vigilante", "visione", "voltic", "voltic2", "xa21", "zentorno", "armytanker", "armytrailer2", "baletrailer", "boattrailer", "cablecar", "docktrailer", "graintrailer", "proptrailer", "raketrailer", "tr2", "tr3", "tr4", "trflat", "tvtrailer", "tanker", "tanker2", "trailerlogs", "trailersmall", "trailers", "trailers2", "trailers3", "freight", "freightcar", "freightcont1", "freightcont2", "freightgrain", "tankercar", "airtug", "caddy", "caddy2", "caddy3", "docktug", "forklift", "mower", "ripley", "sadler", "sadler2", "scrap", "towtruck", "towtruck2", "tractor", "tractor2", "tractor3", "utillitruck", "utillitruck2", "utillitruck3", "bison", "bison2", "bison3", "bobcatxl", "boxville", "boxville2", "boxville3", "boxville4", "boxville5", "burrito", "burrito2", "burrito3", "burrito4", "burrito5", "camper", "gburrito", "gburrito2", "journey", "minivan", "minivan2", "paradise", "pony", "pony2", "rumpo", "rumpo2", "rumpo3", "speedo", "speedo2", "speedo4", "surfer", "surfer2", "taco", "youga", "youga2", "16challenger", "amgc", "m5e60", "ursa", "x5m", "e92", "amggt16", "bentayaga", "c63s", "c63scoupe", "cls08", "cls17", "f12", "g63", "m8", "maybach", "teslaroad", "urus"]
const vehiclesWithoutEngines = ["bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3"]
 
module.exports =
{
    handle: null,

    connect: function(call) {
        this.handle = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'rage_project'
        });

        this.handle.connect(function (err){
            if(err){
                switch(err.code){
                    case "ECONNREFUSED":
                        console.log("\x1b[93m[MySQL] \x1b[97mError: Check your connection details (packages/mysql/mysql.js) or make sure your MySQL server is running. \x1b[39m");
                        break;
                    case "ER_BAD_DB_ERROR":
                        console.log("\x1b[91m[MySQL] \x1b[97mError: The database name you've entered does not exist. \x1b[39m");
                        break;
                    case "ER_ACCESS_DENIED_ERROR":
                        console.log("\x1b[91m[MySQL] \x1b[97mError: Check your MySQL username and password and make sure they're correct. \x1b[39m");
                        break;
                    case "ENOENT":
                        console.log("\x1b[91m[MySQL] \x1b[97mError: There is no internet connection. Check your connection and try again. \x1b[39m");
                        break;
                    default:
                        console.log("\x1b[91m[MySQL] \x1b[97mError: " + err.code + " \x1b[39m");
                        break;
                }
            } else {
                console.log("\x1b[92m[MySQL] \x1b[97mConnected Successfully \x1b[39m");
            }
        });
    }
};

//                                           --------------Login--------------  -----------------Register------------------
mp.events.add("loginConnectPlayer", (player, acctionType, loginName, loginPass, playerEmail) => {

    const loggedAccount = mp.players.toArray().find(p => p.loggedInAs == true); 
    player.setVariable('inRegister', acctionType);

    player.loggedInAs = false;

    mp.events.call("loadVariables", player);
 
    switch(acctionType)
    {
        //Login player
        case 0:
        {
            //Veriffications
            if(!loginName.length|| !loginName.length)
                return player.call("showNotification", [`Characters too small`]);
  
            //if(loggedAccount) 
                //return player.call("showNotification", [`This account already connected.`]);
                
            gm.mysql.handle.query('SELECT `password` FROM `accounts` WHERE `username` = ? LIMIT 1', [loginName], function(err, res){
                
                if(err)
                    return player.call("showNotification", [`Error on database (${err}).`]);

                if(res.length < 0) 
                    return player.call("showNotification", ["This account doesn`t exist"]);
            
                let sqlPassword = res[0]["password"];
                bcrypt.compare(loginPass, sqlPassword, function(err, res2) {
                    
                    //Password is incorrect
                    if(res2 === false)
                        return player.call("showNotification", [`Your password is incorrect.`]);
                      
                    //Destroy browser
                    player.call("destroyLoginBrowser");
                    
                    //Executa logarea
                    player.name = loginName; 
                    gm.auth.loadAccount(player);  
                });
            }); 
            break;
        }
 
        //Register player
        case 1:
        { 
            //Veriffications
            if(loginName.length < 3 || loginPass.length < 5 || playerEmail.length < 5)
                return player.call("showNotification", [`Characters too small`]);
      
            gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `username` = ? LIMIT 1', [loginName], function(err, res) {

                if(err)
                    return player.call("showNotification", ["Error on database."]);
                
                if(res.length > 0)
                    return player.call("showNotification", ["This account already exist"]);
                    
                bcrypt.hash(loginPass, null, null, function(err, hash) {
                    if(!err)
                    { 
                        gm.mysql.handle.query('INSERT INTO `accounts` SET username = ?, password = ?, email = ?', [loginName, hash, playerEmail], function(err2, res2){
                            if(err2)
                                return console.log("\x1b[31m[ERROR] " + err2);
                            
                            //Destroy browser
                            player.call("destroyLoginBrowser");

                            //Executa inregistrarea
                            player.name = loginName; 
                            gm.auth.registerAccount(player);     
                        });
                    } 
                    else console.log("\x1b[31m[BCrypt]: " + err2) 
                }); 
            }); 
            break;
        }
    } 
});
 
mp.events.add("playerQuit", playerQuitHandler);
function playerQuitHandler(player, exitType, reason) 
{  
    player.loggedInAs = false;
    if(player.loggedInAs == true) 
    { 
        gm.auth.saveAccount(player);
 
        player.setVariable('playerLogged', false);

        //House
        player.setVariable('menuHouseOpened', false);
        player.setVariable('requestOnHouse', -1);
 
        //Player in DMV
        if(player.data.InDMV == true)
        {
            //Destroy vehicle
            if(player.data.schoolVehicle)
            {
                player.data.schoolVehicle.destroy();
                player.data.schoolVehicle = null;
            }

            player.data.InDMV = false;
            player.data.dmvStage = 0;
        }

        //Player in Dealership
        if(player.data.inDealership == true)
        { 
            //Destroy vehicle
            if(player.data.dealerVehicle)
            {
                player.data.dealerVehicle.destroy(); 
                player.data.dealerVehicle = null;  
            }
        }

        //Destroy player rent vehicles
        if(player.data.rentedVehicle)
        {
            player.data.rentedVehicle.destroy();
            player.data.rentedVehicle = null;
        }

        //Destroy player personal vehicles
        for(let x = 0; x < player.personal_vehicles.length; x++)
        {
            if(player.personal_vehicles[x].vehicleSpawnID != -1)
            {
                player.personal_vehicles[i].vehicleSpawnID.destroy();
                player.personal_vehicles[x].vehicleSpawnID = -1; 
            }
        }
 
        //Send staff message
        if(player.data.admin > 0)
        {
            sendAdmins(COLOR_ADMIN, `(Quit BOT):!{ffffff} ${player.name} left server (reason: ${exitType}).`);
        } 
    } 
} 

mp.events.add("playerJoin", (player) => {

    player.position = new mp.Vector3(-960.711, -2498.907, 13.987);
  
    console.log(`${player.name} has joined.`);
      
    player.data.dmvStage = false;
    player.data.InDMV = false;
    player.data.drivingLicense = 0;
    player.setVariable('playerMicrophone', false);  
    player.setVariable('playerMenuOpen', false);
    player.setVariable('statusChat', false);  

    player.setVariable('dlActivated', 0);

    player.setVariable('playerFind', -1);

    //House request
    player.setVariable('requestOnHouse', -1);
    player.setVariable('menuHouseOpened', false);

    //House offer
    player.setVariable('houseOffered', -1);
    player.setVariable('houseOfferedMoney', 0);

    //Jobs
    player.setVariable("playerStartedWork", false); 
 
    player.respawnMyself = () => {
        mp.events.call("spawnPlayer", player); 
    } 

    player.IsInRange = (x, y, z, range) => { 
        const dist = player.dist(new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)));
 
        return (dist < parseInt(range)) ? (true) : (false); 
    }   
    
    player.formatMoney = function (n, c, d, t) 
    {
        var c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }  
 
    getNameOnNameID = function(playerNameOrPlayerId) 
    {
        if(playerNameOrPlayerId == parseInt(playerNameOrPlayerId)) return mp.players.at(playerNameOrPlayerId);
        else
        {
            let foundPlayer = null;
            mp.players.forEach((rageMpPlayer) => {
                if(rageMpPlayer.name.toLowerCase().startsWith(playerNameOrPlayerId.toLowerCase())) 
                {
                    foundPlayer = rageMpPlayer;
                    return;
                }
            });
            return foundPlayer;
        }
    }  

    //Send message to admins
    sendAdmins = function(color, message) 
    {
        mp.players.forEach(x => {
			if(x.data.admin > 0 && x.loggedInAs == true) {
	  
				x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
			}
		});  
    } 

    sendStaff = function(color, message) 
    {
        mp.players.forEach(x => {
            if(x.data.admin > 0 || x.data.helper > 0 && x.loggedInAs == true)   
            {
                x.outputChatBox(`${(player.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
            }
        }); 
    }
    
    //Send message to all players
    sendToAll = function(color, message) 
    {
        mp.players.forEach(x => {
            
            if(x.loggedInAs == true) x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
        }); 
    } 
    
    //Send to groups
    sendToGroup = function(color, group, message)
    {
        mp.players.forEach(x => {
            if(x.data.playerGroup != -1 && x.data.playerGroup == group && x.loggedInAs == true)   
            {
                x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
            }
        }); 
    }

    //Send to groups by ID
    sendToGroupID = function(color, type, message) 
    { 
        mp.players.forEach(x => {
            if(x.data.playerGroup != -1 && struct.group[x.data.playerGroup].groupType == type && x.loggedInAs == true)   
            {
                x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
            }
        }); 
    }  
        
    //Send nearby message
    sendLocal = function(player, color, range, message) 
    { 
        mp.players.forEachInRange(player.position, parseInt(range), (x) => {

            if(x.loggedInAs == true) x.outputChatBox(`${(x.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`);
        }); 
    }   

    //Send ussage text
    sendUsage = function(player, message) 
    { 
        if(player.loggedInAs == true) player.outputChatBox(`!{009999}(Usage):!{ffffff} ${message}`);
    }

    //send player message
    sendMessage = function(player, color, message) 
    {
        if(player.loggedInAs == true) 
        {   
            player.outputChatBox(`${(player.data.timeStamp == 1) ? (`[${hour}:${date.getMinutes()}:${date.getSeconds()}] `) : ('')}!{${color}} ${message}`); 
        }
    }  

    getDates = function() 
    { 
        return `${date.getDate()} ${month[new Date().getMonth()]} 2021 [${hour} : ${min < 10 ? `0${min}` : min}]`; 
    }  
}); 

mp.events.add('togglePlayerChat', (player, chatStatus, chatNormal) => { 
 
    if(chatNormal == false) player.call('ToggleChatBoxActive', [!chatStatus]);  
 
    player.setVariable('statusChat', chatStatus);  
}); 

mp.events.add("loadVariables", player => {

    player.giveMoney = (type, amount) => { 

        //TYPE 0 - GIVE MONEY
        //TYPE 1 - REMOVE MONEY
        //TYPE 2 - SET MONEY
 
        //UPDATE VARIABLE
        player.data.money = (type == 0 ? (player.data.money + parseInt(amount)) : type == 1 ? (player.data.money - parseInt(amount)) : (parseInt(amount))); 
         
        //UPDATE MYSQL 
        mysql_action('UPDATE `accounts` SET money = ? WHERE username = ? LIMIT 1', [player.data.money, player.name]); 

        //UPDATE HUD
        player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]);  
    }   
    
    player.give_money_bank = (type, amount) => { 

        //TYPE 0 - GIVE MONEY
        //TYPE 1 - REMOVE MONEY 
 
        //UPDATE VARIABLE
        player.data.moneyBank = (type == 0) ? (player.data.moneyBank + parseInt(amount)) : (player.data.moneyBank - parseInt(amount)); 
         
        //UPDATE MYSQL 
        mysql_action('UPDATE `accounts` SET moneyBank = ? WHERE username = ? LIMIT 1', [player.data.moneyBank, player.name]); 

        //UPDATE HUD
        player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]);  
    }  
  
    player.staffPerms = (level) => { 

        if(player.data.admin == 0)
            return sendMessage(player, 'ff3300', `(Permission):!{ffffff} You are not part of the staff.`);

        if(player.data.admin < level)
            return sendMessage(player, 'ff3300', `(Permission):!{ffffff} You are not a level (!{ff3300}6!{ffffff}) administrator.`); 
    }

    player.createVehicle = (player, model, position, colorOne, colorTwo, rotationPos = player.heading, put = 0) => { 
  
        //CREATE VEHICLE
        const vehicle = mp.vehicles.new(mp.joaat(model), position,
        {     
            color: [colorOne, colorTwo],
            locked: false,
            engine: false,
            dimension: player.dimension,
            type: 'Personal Vehicle',
            owner: player.name 
        });

        vehicle.spawn = position;
        vehicle.spawnRotation = new mp.Vector3(0.0, 0.0, rotationPos);

        vehicle.rotation = new mp.Vector3(0.0, 0.0, rotationPos);
  
        //PUT IN VEHICLE
        if(put == 1) player.putIntoVehicle(vehicle, 0);  
  
        //SET VEHICLE VARIABLES
        vehicle.setVariable('vehicleGass', 100); 
        vehicle.setVariable('vehicleName', model);
        vehicle.setVariable('vehicleOwner', player.name);

        if(!player.vehicleModelHaveEngine(vehicle.model)) player.call("setEngineState", [false, player]);
  
        return vehicle;
    }

    player.vehicleValid = (name) => { 
         
        return (vehiclesData.includes(name) ? (true) : (false)); 
    }

    player.vehicleModelHaveEngine = (name) => { 

        return (vehiclesWithoutEngines.includes(name) ? (true) : (false)); 
    }

    player.vehicleModel = (vehicle) => {
     
        return vehicle.getVariable('vehicleName'); 
    }

    player.vehicleOwner = (vehicle) => {
     
        return vehicle.getVariable('vehicleOwner'); 
    }
 
    player.isAtJob = (x) => {

        return (player.IsInRange(struct.jobs[x].jobWorkPosX, struct.jobs[x].jobWorkPosY, struct.jobs[x].jobWorkPosZ, 5) ? (true) : (false));
    } 

    player.allWeapons = () => {

        for(let x = 0; x < weaponsData.length; x ++)
        {
            return weaponsData[x];
        } 
    }

    player.getGender = (gender) => {
 
        return (gender == 0 ? ('male') : ('female')); 
    } 

    //Inventory
    player.apply_clothes = () => {

        for(let x = 0; x < player.inventory.length; x++)
        {      
            if(player.inventory[x].type < 500 && player.inventory[x].invUsed == true) 
            {   
                switch(player.inventory[x].indexItem)
                {
                    case "jeans": player.setClothes(4, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Jeans
                    case "shoes": player.setClothes(6, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0), 0); break; //Shoes
                    case "jacket": 
                    {
                        player.setClothes(11, player.inventory[x].type, player.inventory[x].invColor, 0);  
                        break; //Jacket
                    }
 
                    case "hat": player.setProp(0, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (8), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0)); break; //Hat
                    case "glasses": player.setProp(1, (player.inventory[x].invUsed == true) ? (player.inventory[x].type) : (0), (player.inventory[x].invUsed == true) ? (player.inventory[x].invColor) : (0));  break; //Glasses 
                } 
            } 
        }         
    }
 
    player.sendLoginRegMessage = (player, status) => {
  
        mp.events.call("spawnPlayer", player); 

        switch(status)
        {
            //Login message
            case 0:
            {  
                sendMessage(player, '8080ff', `(Server):!{fffffff} Welcome back {8080ff}${player.name} [${player.id}]!{fffffff}.`);    
                sendMessage(player, '8080ff', `(Server):!{fffffff} Last online ${player.data.lastOnline}.`); 

                if(player.data.admin > 0) 
                {
                    sendMessage(player, `e60000`, `>> INFO:!{fffffff} You are connected with admin level ${player.data.admin}.`);    
                }

                if(player.data.username === "alex"){
                    sendMessage(player, 'e60000',`>> INFO:!{fffffff} You are the owner of this shit.`)
                }

                if(player.data.admin > 0) sendAdmins('e60000', `>> GREETER:!{fffffff} ${player.name} [${player.id}] connected to the server.`);

                if(player.data.playerGroup != -1)
                {
                    sendToGroup(`66b3ff`, player.data.playerGroup, `>> GROUP:!{fffffff} ${player.name} [${player.id}] from your group has been logged in.`);
                } 
 
                mp.events.call("load_caracter_data", player);
                break;
            } 

            //Register message
            case 1:
            { 
                sendMessage(player, `8080ff`, `(Server):!{fffffff} Welcome {8080ff}${player.name} [${player.id}]!{fffffff}.`);
                sendMessage(player, `8080ff`, `(Server):!{fffffff} For more informations use command !{8080ff}[/informations]!{fffffff}.`);   
    
                gm.mysql.handle.query('SELECT * FROM `accounts` WHERE `username` = ? LIMIT 1', [player.name], function(err, results) {   
                    if(err) 
                    {
                        console.log(err);
                        player.call("showNotification", [`[ERROR]: Please try again.`]);
                        return;
                    } 

                    player.data.sqlid = results[0].id; 
                    
                    //Load players vehicle
                    mp.events.call("loadPlayerVehicles", player, player.data.sqlid);
                    
                    //Load inventory
                    mp.events.call("loadPlayerInventory", player, player.data.sqlid);

                });    

                //START CREATOR
                mp.events.call("start_creator", player); 
                break;
            }
        }
    
        player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]); 
    }
}); 