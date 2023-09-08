"use strict";

let struct = module.exports; 
 
struct.jobs = new Array(999); 
struct.houses = new Array(999);
struct.business = new Array(999);
struct.group = new Array(999);
struct.rent = new Array(999);
struct.dealership = new Array(999);
struct.playerVehicles = new Array(999);  
struct.contacts = new Array(900);
struct.plantLabel = new Array(900);
   
for(let i = 0; i <= 999; i++) {

    struct.jobs[i] = {
        jobID: 0,
        jobName: new Array(999), 
        job3DText: new Array(999),
        jobPickup: new Array(999),

        jobWork3DText: new Array(999),
        jobWorkPickup: new Array(999),

        jobX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        jobY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        jobZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),

        jobWorkPosX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        jobWorkPosY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        jobWorkPosZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)) 
    }; 
 
    struct.houses[i] = {
        houseID: 0,
        houseRent: 0,
        housePrice: 0,
        houseBalance: 0,
        houseStatus: 0,
        houseDescription: new Array(999), 
        houseOwner: new Array(999), 
        house3DText: new Array(999),
        house3DTextInt: new Array(999),
        houseBlip: new Array(999),
          
        houseX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        houseY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        houseZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        houseHeading: new mp.Vector3(parseFloat(1.1)),

        houseIntX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        houseIntY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        houseIntZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1))

    };  
 
    struct.business[i] = {
        bizzID: 0,
    
        bizzPrice: 0,
        bizzFee: 0,
        bizzBalance: 0,
        bizzType: 0,

        bizzDescription: new Array(999), 
        bizzOwner: new Array(999), 
        bizz3DText: new Array(999),
        bizzBlip: new Array(999),

        bizzX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        bizzY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        bizzZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),

        bizzIntX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        bizzIntY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        bizzIntZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1))

    };  

    struct.group[i] = {
        groupID: 0, 
        groupName: new Array(999),  
        group3DText: new Array(999), 
        groupPickup: new Array(999), 
        groupType: new Array(999),

        groupExitX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        groupExitY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        groupExitZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),

        groupIntX: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        groupIntY: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        groupIntZ: new mp.Vector3(parseFloat(1.1), parseFloat(1.1), parseFloat(1.1)),
        groupIntHead: new Array(999) 

    };  
 
    struct.rent[i] = {
        rentModelID: 0, 
        rentModelName: new Array(999),  
        rentModelPrice: new Array(999), 
        rentModelStock: new Array(999) 
    };  

    struct.dealership[i] = {
        dealerID: 0, 
        dealerName: new Array(999),  
        dealerPrice: new Array(999), 
        dealerStock: new Array(999),
        dealerLink: new Array(999),
        dealerSpeed: new Array(999)
    };   
 
    struct.plantLabel[i] = {
        plantText: new Array(999),  
        plantID: new Array(999) 
    };  
} 