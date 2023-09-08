let characterBrowser = null;
let creatorCamera;

var features = [];
for(var i = 0; i < 20; i++) features[i] = 0.0;

var appearance = [];
for(var i = 0; i < 11; i++) appearance[i] = 255;

//FATHERS AND MOTHERS
var fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
var mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];

var gender = 0;
var father = 0; 
var mother = 21; 
var similarity = 0.5;
var skin = 0.5;
 
var eyeColor = 0; 
 
var hair = 0;
var hairColor = 0;

global.hairIDList = [
    //male
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 30, 31, 32, 33, 34, 73, 76, 77, 78, 79, 80, 81, 82, 84, 85],
    
    //female
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 31, 76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 90, 91]
];

//Variables
const localPlayer = mp.players.local;
  
mp.events.add("createCharacter", (player) =>
{  
    //Create CEF
    if(characterBrowser == null) characterBrowser = mp.browsers.new("package://CEF/characterCreator/index.html");   
    
    
    mp.gui.cursor.visible = true;  

    //Hide CHAT
    //mp.gui.chat.show(false);

    //Freeze PlAYER
    localPlayer.freezePosition(true);
    localPlayer.setRotation(0.0, 0.0, -185.0, 2, true);
      
    //Create CAMERA
    creatorCamera = mp.cameras.new("creatorCamera", new mp.Vector3(402.8664, -997.5515, -98.5), new mp.Vector3(0, 0, 0), 45);
    creatorCamera.pointAtCoord(402.8664, -996.4108, -98.5);
    creatorCamera.setActive(true); 
    mp.game.cam.renderScriptCams(true, false, 500, true, false);

    //Set ANIMATION
    localPlayer.taskPlayAnim("amb@world_human_guard_patrol@male@base", "base", 8.0, 1, -1, 1, 0.0, false, false, false);

    //Reset FACE
    updateCharacterParents();
    localPlayer.setEyeColor(parseInt(0));
    for (var i = 0; i < 20; i++) localPlayer.setFaceFeature(i, 0.0);
}); 

mp.events.add("changeGender", (type, i) => { 

    var lvl = parseFloat(i);
 
    switch(type)
    {
        //CHANGE SEX
        case 0:
        {  
            gender = i; 
            appearance[1] = 255;
  
            updateCharacterParents(); 
            updateAppearance();

            mp.events.callRemote("creator_GenderChange", i);
            setTimeout(() => { mp.events.call("changeHairEvent", hair); }, 500); 
            break;
        }

        //CHANGE MOTHER
        case 1:
        {
            mother = mothers[i];
            updateCharacterParents();
            break;
        }

        //CHANGE FATHER
        case 2:
        {
            father = fathers[i];
            updateCharacterParents();
            break;
        }

        //CHANGE CHARACTER COLOR
        case 3:
        {  
            break;
        }
    
        //Eyes color
        case 4:
        {  
            eyeColor = parseInt(i); 
            localPlayer.setEyeColor(eyeColor);
            break;
        }
    
        //Eyes size
        case 5:
        { 
            localPlayer.setFaceFeature(11, lvl); 
            features[11] = lvl;
            break;
        }

        //NOSE WIDTH
        case 6:
        {  
            localPlayer.setFaceFeature(0, lvl); 
            features[0] = lvl;
            break;
        } 
  
        //NOSE HEIGHT
        case 7:
        {  
            localPlayer.setFaceFeature(1, lvl); 
            features[1] = lvl;
            break;
        } 
 
        //Eyebrow height
        case 8:
        {  
            localPlayer.setFaceFeature(6, lvl); 
            features[6] = lvl;
            break;
        }  
    } 
}); 

//CHANGE MOTHER AND FATHER 
function updateCharacterParents() 
{
    localPlayer.setHeadBlendData(mother, father, 0, mother, father, 0, similarity, skin, 0.0, true);  
}  
 
//HAIR STYLE
mp.events.add("changeHairEvent", (hairID) => { 

    hair = parseInt(hairID);  
    localPlayer.setComponentVariation(2, hairIDList[gender][hair], 0, 0);
     
}); 

//HAIR COLOR
mp.events.add("changeHairColor", (hairID) => { 
 
    hairColor = parseInt(hairID); 
    localPlayer.setHairColor(hairColor, 0);
    updateAppearance();
}); 

//BEARD STYLE
mp.events.add("changeBeard", (value) => { 
  
    var overlay = (value == 0) ? 255 : value - 1;
    appearance[1] = overlay;
 
    updateAppearance();
}); 
 
function updateAppearance()
{
    for(var i = 0; i < 11; i++) 
    {
        localPlayer.setHeadOverlay(i, appearance[i], 100, 0, 0);
    }

    localPlayer.setHeadOverlayColor(1, 1, hairColor, 100); //beard
}
 
//EYES COLOR
mp.events.add("changeEyesColor", (colorID) => { 

    eyeColor = parseInt(colorID); 
    localPlayer.setEyeColor(eyeColor);
}); 
 
mp.events.add('characterSave', () => {
  
    if(characterBrowser != null) 
    { 
		characterBrowser.destroy();
		characterBrowser = null;
         
        creatorCamera.destroy();
        mp.game.cam.renderScriptCams(false, false, 3000, true, true); 

        localPlayer.freezePosition(false);

		let currentGender = (gender) ? 0 : 1;
  
        //Show chat
        mp.gui.cursor.visible = false; 
        mp.gui.chat.show(true);
 
		mp.events.callRemote("creator_finish", currentGender, mother, father, skin, hairIDList[gender][hair], hairColor, eyeColor, features[11], features[6], features[0], features[1], appearance[1]);
	}
});
 
mp.events.add("set_player_character", (player, skinGender, skinMother, skinFather, playerSkin, skinHair, hairColor, skinEyeColor, skinEyeSize, skinEyeBrowHeight, skinNoseWidth, skinNoseHeight, skinBeard) => {
       
    //Eye color = terminat
    player.setEyeColor(parseInt(skinEyeColor));

    //Eye size = terminat
    features[11] = skinEyeSize;

    //NOSE WIDTH
    features[0] = skinNoseWidth;
 
    //NOSE HEIGHT
    features[1] = skinNoseHeight;
 
    //Eyebrow height
    features[6] = skinEyeBrowHeight;
 
    //Hair style
    player.setComponentVariation(2, skinHair, 0, 0);
 
    //Barba 
    appearance[1] = skinBeard;
   
    for(var i = 0; i < 20; i++) player.setFaceFeature(i, features[i]);
    for(var i = 0; i < 11; i++) player.setHeadOverlay(i, appearance[i], 100, 0, 0);
 
    //Beard color
    player.setHeadOverlayColor(1, 1, hairColor, 100);  
 
    //Hair color
    player.setHairColor(hairColor, 0);
    
    player.setHeadBlendData(skinMother, skinFather, 0, skinMother, skinFather, 0, 0.5, playerSkin, 0.0, true);   
});