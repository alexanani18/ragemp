//VARIABLES
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0; 
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
  
//START MENU CHARACTER CREATOR
mp.events.add("start_creator", (player) => {

    //Set POSITION
    player.position = creatorPlayerPos;
    player.heading = creatorPlayerHeading;
    player.dimension = (player.id + 1);
    player.model = freemodeCharacters[0];
    
    player.call('createCharacter', [player]); 

});
   
//CREATOR FINISH
mp.events.add("creator_finish", (player, gender, mother, father, skin, hairStyle, haircolor, eyeColor, eyeSize, eyeBrowHeight, noseWidth, noseHeight, beard) => {
     
    player.dimension = 0;
    player.spawn(new mp.Vector3(-1041.147, -2744.269, 21.359)); 
    player.heading = parseFloat(327.559);   
 
    //SET VARIABLES
    player.data.gender = gender;
    player.data.mother = mother;
    player.data.father = father;
    player.data.skin = skin;
    player.data.hairStyle = hairStyle;
    player.data.hairColor = haircolor;
    player.data.eyeColor = eyeColor;
    player.data.eyeSize = eyeSize;
    player.data.eyeBrowHeight = eyeBrowHeight;
    player.data.noseWidth = noseWidth;
    player.data.noseHeight = noseHeight;
    player.data.beard = beard;

    //MYSQL
    mysql_action('INSERT INTO `server_characters` SET owner = ?, gender = ?, mother = ?, father = ?, skin = ?, hair = ?, hairColor = ?, eyeColor = ?, eyeSize = ?, eyeBrow = ?, noseWidth = ?, noseHeight = ?, beard = ?', [player.data.sqlid, gender, mother, father, skin, hairStyle, haircolor, eyeColor, eyeSize, eyeBrowHeight, noseWidth, noseHeight, beard]);
 
    //APPLI TO CHARACTER
    player.call('set_player_character', [player, player.data.gender, player.data.mother, player.data.father, player.data.skin, player.data.hairStyle, player.data.hairColor, player.data.eyeColor, player.data.eyeSize, player.data.eyeBrowHeight, player.data.noseWidth, player.data.noseHeight, player.data.beard]);  
});
  
//Change GENDER
mp.events.add("creator_GenderChange", (player, gender) => {
    player.model = freemodeCharacters[gender];
    player.position = creatorPlayerPos;
    player.heading = creatorPlayerHeading;
    player.changedGender = true;
});
 
mp.events.add("load_caracter_data", (player) => {
 
    gm.mysql.handle.query('SELECT * FROM `server_characters` WHERE `owner` = ? LIMIT 1', [player.data.sqlid], function(err, results) {   
        if(err) 
        {
            console.log(err);
            player.call("showNotification", [`[ERROR]: Please try again.`]);
            return;
        } 
 
        if(results.length)
        { 
            //SET PLAYER DATA VARIABLES
            player.data.owner = results[0].owner;
            player.data.gender = results[0].gender;
            player.data.mother = results[0].mother;
            player.data.father = results[0].father;
            player.data.skin = results[0].skin;
            player.data.hairStyle = results[0].hair;
            player.data.hairColor = results[0].hairColor;
            player.data.eyeColor = results[0].eyeColor;
            player.data.eyeSize = results[0].eyeSize;
            player.data.eyeBrowHeight = results[0].eyeBrow;
            player.data.noseWidth = results[0].noseWidth;
            player.data.noseHeight = results[0].noseHeight;
            player.data.beard = results[0].beard;
 
            player.model = (player.data.gender == 1) ? (mp.joaat("mp_f_freemode_01")) : (mp.joaat("mp_m_freemode_01"));

            //APPLY CHARACTER DATA
            player.call('set_player_character', [player, player.data.gender, player.data.mother, player.data.father, player.data.skin, player.data.hairStyle, player.data.hairColor, player.data.eyeColor, player.data.eyeSize, player.data.eyeBrowHeight, player.data.noseWidth, player.data.noseHeight, player.data.beard]);  
       
            //APPLY CLOTHES 
            player.apply_clothes();
        } 
        else 
        {
            mp.events.call("start_creator", player); 
        } 
    });    
});