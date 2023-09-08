require("../functions.js");
require("../auth.js");
   
var mysql = require('mysql');   
var struct = require('../struct.js');
 
/*
    --------------------------------------------------------------UPDATE V 0.1--------------------------------------------------------------

    Adaugat sistem de admini si helperi
    Adaudate comenzile /setadmin si /sethelper pentru adminii level 7+
    Adaugata comanda /admins si /helpers (salvari database)
    Adaugat stockul 'chat.admin' pentru a trimite mesaje adminilor
    Adaugata comanda /spawncar pentru adminii level 1+
    Adaugata comanda /a (chat admini)
    Adaugata comanda /hc (chat admini si helperi)
    Adaugata comanda /spawnweapon [player] [gun] [buletts] pentru adminii level 1+
    Adaugata comanda /disarm [playerid] pentru adminii level 1+
    Adaugata comanda /pm pentru adminii level 1+
    Adaugata comanda /repair si /flip pentru adminii level 1+
    Adaugata comanda /kick pentru adminii level 2+
    Adaugata comanda /anno pentru adminii level 3+
    Adaugata comanda /goto si /gethere pentru adminii level 1+
    Adaugata comanda /warn pentru adminii level 4+
    Adaugata comanda /set pentru adminii level 6+
    Adaugata comanda /ah pentru adminii level 1+
    Adaugata comanda /mark si /gotomark pentru adminii level 1+
    Adaugata comanda /getcar pentru adminii level 2+
     
    Adaugata comanda /transfer [player] [amount]
    Adaugata comanda /deposit [amount]
    Adaugata comanda /withdraw [amount]
    Adaugata comanda /pay [player] [amount]
 
    Adaugat stockul 'sendUsage' pentru a trimite sintaxa
    Adaugat stockul 'chat.sendToAll' pentru a trimite mesaje tuturor playerilor
    Adaugata functia in care daca comanda nu exista sa iti zica ca nu exista
    Adaugata o functie prin care dai experienta si se updateaza si levelul
    Adaugat un speedometer

    Adaugata comanda level, experience, money, bank money in database
    Adaugata comanda /stat in care arata toate detaliile 
    Adaugata comanda /id 
    Adaugata comanda /timestamp
    Adaugat un TextDraw ce arata ora si data + inca unu ce arata logo-ul.
    Adaugat sistemul de Driving School trebuie sa mergi cu masina prin cele 9 checkpointuri.
    Adaugat un web la Driving school unde iti arata cate checkpointuri mai ai 
    ------------------------------------------------------------------------------------------------------------------------------------------

    --------------------------------------------------------------UPDATE V 0.2--------------------------------------------------------------
    Adaugata comanda /check pentru adminii level 4+ 
    Adaugat sistemul de joburi (load din database)
        - label cu informatii si pick-up
        - comanda /gotojob pentru adminii level 2+
        - comanda /stopwork pentru a nu mai munci
        - Tast Y pentru a lua un job
        - Tasta N pentru a parasi jobul
        - Adaugat jobul Pizza boy unde livrezi pizza random la case
        - Adaugat jobul Trucker (momentan decat 3 curse)
         
    Adaugat sistemul de case (load din database)
        - label cu informatii si pick-up.
        - adaugat pe mapa o iconita cu casa
        - adaugata tasta F pentru a putea intra/iesi din casa.
        - adaugata comanda /buyhouse pentru a cumpara o casa.
        - adaugata comanda /rentroom pentru a inchiria o casa
        - adaugata comanda /unrentroom pentru a anula inchirierea unei case.
        - acum in /stats iti arata si daca ai o casa (rent sau cumparata)
        - comanda /gotohouse pentru adminii level 2+.
        - adaugata comanda /findhouse pentru a localiza o casa
 
    Acum pe tasta TAB iti va aparea un browser cu toti playerii online

    Adaugate functiile de DEATH si RESPAWN
    Ordonat putin GameMode-ul (pe fisiere)
    Adaugata comanda /timestamp (pentru a arata data in stanga chatului)
    Adaugat sistemul de bani (Hud + functii de remove, give, set money)

    Adaugata comanda /mute pentru adminii level 2+
    Adaugata comanda /unmute pentru adminii level 2+
    ------------------------------------------------------------------------------------------------------------------------------------------

    --------------------------------------------------------------UPDATE V 0.3--------------------------------------------------------------
    Acum comanda /stats va arata informatiile tip CEF (browser)
    La vehicule a fost adaugata functia de start/stop engine (tasta 2 respectiv comanda /engine)
    La vehicule a fost adaugata functia de lock/unlock doors (tasta N respectiv /lock /unlock)
    Adaugat un mic speedometer (ceva simplu)
    Adaugat payday individual (1 ora)
        - Primesti bani in banca (random)
        - Platesti chiria la casa (daca ai)
        - Primesti random experienta
    Adaugat stockul sendLocal (trimite un mesaj pe o anumita raza stabilita de tine)
    Rezolvat Browserul ce arata toti playerii online (il arata decat pe primu de pe server)

    Adaugat sistem de Rent vehicles (dinamic)
        - Facuta incarcarea din baza de date 
        - Adaugata comanda /rentcar (sub forma de Browser)
        - Adaugata comanda /addrentvehicle <model> <price> <stock>
    Modificata interfata login
    Adaugata comanda /jobs (BROWSER) prin care poti seta un checkpoint la job sau sa te teleportezi la el (ca admin)
    Rezolvat un bug la chatu global de nu aparea
    Adaugata o restrictie la /a
    Rezolvat un bug la comanda /setadmin
    Rezolvat un bug la /anno
    Ceasul este acum sincronizat cu cel din real life (Romania)
    Rezolvat un bug la server tab 
    Chatul normal a fost modificat (este acum mai mic si mai aranjat)
    ----------------------------------------------------------------------------------------------------------------------------------------

    --------------------------------------------------------------UPDATE V 0.4--------------------------------------------------------------
    Rezolvat bugul la trucker de nu mergea sa mai selectezi cursa
    Adaugat in server o functie care transmite anumite chestii la profilul playerului (rich presence)   
    Rezolvat un bug la Driving School
    Rezolvat un bug la PayDay prin care pica serverul
    Adaugat sistem de alerte (info, error, succes)
    Acum poti inchide/deschide doar masina de la rent car
    Modificat hud:
        - adaugat un progress bar ce arata nivelul foamei/mancarei
        acestea scad in functie de cat de mult alergi si mai scad singure odata la 3 minute (-2%)
    Adaugat sistemul de dealership (dinamic)
    Adaugate mesaje de login/quit pentru admini, membrii factiunii si pentru cei din raza ta (20M)
    Modificata interfara cu playerii online
    Modificata interfata principala
    Adaugat un hud pentru vehicule ce arata viteza, statusul motorului, statusul portierei, combustibil
    Acum cand esti in login nu mai poti accesa alt browser. 
    Adaugat sistem de notificari 
    Adaugata comanda /setlicense pentru adminii 6+
    Adaugat la dealership si o functie prin care poti selecta absolut ce culoare doresti
    Acum la login iti apare ultima logare
    Adaugat sistem de ATM & BANK cu interfata CEF (deposit, transfer, withdraw)
    Adaugat sistem de Gas Station si Gas la vehicule
    Modificata putin interfata cu playerii online
    ----------------------------------------------------------------------------------------------------------------------------------------

    --------------------------------------------------------------UPDATE V 0.5--------------------------------------------------------------
    Adaugat business de tip Gas Station cu interfata CEF
    Adaugat business de tip Gun Shop cu interfata CEF
    Adaugat business de tip 24/7 cu interfata CEF
    Rezolvat un bug la ATM prin care atunci cand nu aveai bani necesari interfata cef nu se actualiza
    Rescris inreg sistemul de register/login cap - coada
    Finalizat jobul Fisherman 
    Acum la login daca apesi T nu mai apare chatul
    Acum timpul (ninsoare, soare, ploaie) este in functie de vremea dintr-un oras (Brasov) la fel si ora (noapte, zi, amiaza) este setat dupa ora romaniei
    La vehicule personale a fost adaugata  functia pentru a-ti seta singur o culoare dorita
    Adaugat sistem de inventar:
        - Itemele pot fi folosite apasand butonu "use"
        - Pentru a vedea diferite detalii despre un item puteti apasa butonul "info"
        - Acum hainele din "clothes" se pun si pe caracterul din dreapta
        - Acum in inventar iti arata si licentele tale (nume - ore valabile pentru licenta)

    Acum voice chat-ul va functiona doar daca ai apasata tasta [X]
    Modificat putin CEF-ul ce iti arata tastele principale

    Adaugat sistem de reporturi:
        - Adaugata comanda /report cu interfata CEF unde poti pune numele la cel raportat, prioritatea (camp obligatoriu) si descriere (camp obligatoriu)
        - Adaugata comanda /reports pentru administratori cu interfata CEF 
        - Optiuni: 
            - Open report
            - Close report (cu motiv)
            - View more (in caz ca descrierea e mare)
            - Teleport la cel ce da reportul
            - Teleport la cel pe care a fost dat reportul. 
    Acum la biciclete nu se mai poate folosi tasta [2] pentru a "o porni"
    Modificat putin codul la ATM-uri (acum este mai optimizat)
 
    De bagat sistem de /find + hud  
    La gas station de facut verificarea daca ai banii necesari  
    /va - respawn masini dintr-o raza de 30m  
    De bagat comanda /clearchat  
    De bagat comanda /setdimension (virtual world)  
    De bagat comanda /ah pentru a vedea comenzile pentru admin  
    Cand playerul se deconnecteaza sa se despawneze vehiculele personale / vehiculu din DMV / vehiculul din Dealership  
    De adaugat comanda /dl  
    Rezolvat bugu prin care masina se oprea/pornea aiurea  
    Functia "isValidVehicle" trebuie rescrisa  
    Acum cand iei damage iti arata si in hud  
    Terminat Character Creator  
    ---------------------------------------------------------------------------------------------------------------------------------------- 
 
    --------------------------------------------------------------UPDATE V 0.6--------------------------------------------------------------
 
    De terminat clothing store  
    Terminata partea de clothing store la inventar  
    Mofificat interfetele la driving school  
    Adaugat un sistem de white-list
        - Cand acesta este activat pe server au acces doar anumiti playeri
        - Adaugata comanda /whitelist pentru a activa/dezactiva white-listul
    Adaugata comanda /carcolor <id_masina> <culoare1> <culoare2> 
    Rezolvat un bug la Driving School care facea serverul sa pice
    Adaugata comanda /info pentru a scoate bara cu informatii
    Adaugat sistem de lumini la masina (tasta H)
    Adaugat buton de "drop item" la inventar
    Acum cand cumperi ceva din clothing hainele vor ramane pe tine
    Rezolvat un bug care atunci cand te spawnai nu iti punea hainele corect
    Modificat aspect inventar
    Modificat aspect speedometer
    
    ---------------------------------------------------------------------------------------------------------------------------------------- 
*/
 
mp.events.add('playerCommand', (player, command) => {        
    player.outputChatBox(`${command} is not a valid command, use /help to find a list of commands.`);
});
 
mp.events.add("givePlayerExperience", (player, experienceToGive) => {

    player.data.experience = player.data.experience + experienceToGive;
      
    sendMessage(player, 'ffcc00', `You received ${experienceToGive} experience (total ${player.data.experience}, need ${player.data.needExperience} for next level ${player.data.level + 1}).`); 

    if(player.data.experience >= player.data.needExperience)
    {
        let lastExperience = player.data.needExperience;

        player.data.experience = parseInt(0);
        player.data.needExperience = player.data.needExperience + parseInt(300);
        player.data.level ++;
 
        sendMessage(player, '00cc66', `(Next level):!{ffffff} You advanced to level ${player.data.level} because you accumulated ${lastExperience} experience.`); 
    }
 
    mysql_action('UPDATE `accounts` SET level = ?, experience = ?, needExperience = ? WHERE username = ?', [player.data.level, player.data.experience, player.data.needExperience, player.name]); 
});

//Player commands   
mp.events.add("deschideTab", (player) => {  
 
    let tabString = '';
    let total_players = 0;
  
    mp.players.forEach(users => {
        if(users.loggedInAs == true)
        { 
            tabString += `<tr><td>#${users.id}</td><td>${users.name}${(users.data.admin > 0) ? ('<br><span class="badge badge-pill badge-success float-center">admin</span>') : ("")}</td><td>${(users.data.playerGroup == -1) ? ('none') : (struct.group[users.data.playerGroup].groupName)}</td><td>${users.getGender(player.data.gender)}</td><td>${users.ping}</td></tr>`; 
            
            total_players ++;
        }   
    }); 

    player.call((player.getVariable('playerTabOpened') == 1) ? ("closeStatsBrowser") : ("showTabBrowser"), [tabString, total_players]);  
    player.setVariable('playerTabOpened', !player.getVariable('playerTabOpened'));    
    return;
});
  
mp.events.addCommand('timestamp', (player) => { 
  
    player.data.timeStamp = !player.data.timeStamp;
    sendMessage(player, 'ffffff', `Timestamp is now ${(player.data.timeStamp == 1) ? ("!{09ed11}enabled") : ("!{ff4d4d}disabled!")}`); 
});  
  
///////////////////////////////////////////////////////////////// SHOP SISTEM /////////////////////////////////////////////////////////////////   
mp.events.add("load_shop_items", (player, itemType, itemName, itemAmount, itemPrice, payType) => {  

    //VERIFFICATION
    if((player.data.money < itemPrice && payType == 2) || (player.data.moneyBank < itemPrice && payType == 1)) 
        return player.call("showNotification", ["You don`t have this money."]);
 
    //GIVE ITEM
    mp.events.call("givePlayerItem", player, true, itemType, itemAmount, itemName, -1); 
 
    //REMOVE MONEY
    (payType == 1) ? (player.give_money_bank(1, itemPrice)) : (player.giveMoney(1, itemPrice))

    //MESSAGE
    sendMessage(player, '0AAE59', `(Shop):!{ffffff} You purchase a ${itemName} for !{ff4d4d}${player.formatMoney(itemPrice, 0)}!{ffffff}$ (with ${(payType == 1) ? ("!{3AAED8}Card") : ("!{0AAE59}Cash")}!{ffffff}).`);
});

mp.events.addCommand('info', (player) => { 
 
    player.data.hudStatus = !player.data.hudStatus;

    //NOTIFFICATION
    player.call("showNotification", [`You ${(player.data.hudStatus == 1) ? ("enabled") : ("closed")} info hud.`]);

    //MYSQL
    mysql_action('UPDATE `accounts` SET hudStatus = ? WHERE username = ? LIMIT 1', [player.data.hudStatus, player.name]);

    //UPDATE HUD
    player.call('openPlayerHud', [player.formatMoney(player.data.money, 0), player.formatMoney(player.data.moneyBank, 0), player.health, player.armour, player.data.hunger, player.data.thirst, player.data.hudStatus]);  
});  


/*const threePoss = [
    [409.7867, -982.5424, 29.2700],
    [398.4025, -995.6973, 29.4458],
    [406.7680, -1011.663, 29.3923],
    [422.1708, -1014.831, 29.0730] 
];
 
for(let x = 0; x < threePoss.length; x ++) 
{
    const colshape = mp.colshapes.newSphere(threePoss[x][0], threePoss[x][1], threePoss[x][2], 3); 
    colshape.orangeCollectorTree = x + 1;


    mp.labels.new(`Station: ~r~${x}~s~\nUse ~b~E~s~ to interract`, new mp.Vector3(threePoss[x][0], threePoss[x][1], threePoss[x][2]),
	{
		los: false,
		font: 4,
		drawDistance: 50,
		dimension: 0
    }); 

}
 
mp.events.add('playerEnterColshape', (player , shape) => {

    if(shape.orangeCollectorTree) 
    {
        sendMessage(player, '0AAE59', `entered ${shape.orangeCollectorTree}`);

    }  
});*/ 

mp.events.addCommand("playanim", (player, fullText, dict, name, id) => {
    if(dict == undefined || name == undefined || id == undefined) return sendMessage(player, '0AAE59', '/playanim [dict] [name] [id]');
    play_animation(player, dict, name, 1, parseInt(id));
});

mp.events.addCommand("facial", (player, fullText, dict, name) => {
    if(dict == undefined || name == undefined) return sendMessage(player, '0AAE59', '/playanim [dict] [name] [id]');

    player.call("play_facial_anim", [player, dict, name]);  
   
});
  
//ENTITY
mp.events.add('apply_entity_select', (player, id, title) => {

    //-------------------------------------------- [EMOTES] --------------------------------------------//
    switch(id)
    {
        case "handsup": play_animation(player, "mp_bank_heist_1", "guard_handsup_loop", 1, 49); break; 
        case "dance": play_animation(player, "anim@amb@nightclub@dancers@crowddance_groups@", "mi_dance_crowd_17_v2_male^3", 1, 39); break; 
        case "peace": play_animation(player, "mp_player_int_upperpeace_sign", "mp_player_int_peace_sign_exit", 1, 2); break; 
        case "middlefinger": play_animation(player, "anim@mp_player_intcelebrationmale@finger", "finger", 1, 1); break; 
        case "stop": play_animation(player, "mini@strip_club@idles@bouncer@stop", "stop", 1, 1); break; 
        case "salute": play_animation(player, "anim@mp_player_intcelebrationmale@salute", "salute", 1, 1); break; 
    } 
});
 
function play_animation(player, dict, name, speed, flag)
{ 
    player.playAnimation(dict, name, speed, flag)
 
    setTimeout(() => {player.stopAnimation()}, 5000);
}

 
mp.events.add('click_entity', (player, entityX, entityY, hitEntity) => {

    sendMessage(player, '0AAE59', `X: ${entityX} and Y: ${entityY} (Entity: ${hitEntity})`);   
});

/*

    ----- [ INTERRACTION MENU ] -----
    1. Facuta partea cu emotes
    
 
*/ 