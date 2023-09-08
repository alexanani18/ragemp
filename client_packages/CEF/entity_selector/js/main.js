'use strict';

var menuItems = [
    {
        id   : 'vehicle',
        title: 'Vehicle',
        icon: '#vehicle',
        items: [
            {
                id   : 'trunk',
                title: 'Trunk',
                icon: '#trunk'
            },
            {
                id   : 'hood',
                title: 'Hood',
                icon: '#hood'
            },
            {
                id   : 'lock',
                title: 'Lock/unlock',
                icon: '#lock'
            },
            {
                id   : 'fill',
                icon : '#fill',
                title: 'Fill vehicle'
            },
            {
                id   : 'frontright',
                icon : '#frontright',
                title: 'Front right'
            },
            {
                id   : 'frontleft',
                icon : '#frontleft',
                title: 'Front left'
            }
        ]
    },
    {
        id   : 'entity',
        title: 'Select entity',
        icon: '#entity',
        items: [
            {
                id   : 'trade',
                title: 'Trade',
                icon: '#trade'
            },
            {
                id   : 'tip',
                title: 'Tip',
                icon: '#tip'
            },
            {
                id   : 'mute',
                title: 'Mute',
                icon: '#mute'
            } 
        ]
    },
     
    {
        id   : 'expressions',
        title: 'Expressions',
        icon: '#expressions'
    },
    {
        id   : 'walk',
        title: 'Walking',
        icon: '#walk',
        items: [
            {
                id   : 'eat',
                title: 'Eat',
                icon: '#eat'
            },
            {
                id   : 'sleep',
                title: 'Sleep',
                icon: '#sleep'
            },
            {
                id   : 'shower',
                title: 'Take Shower',
                icon: '#shower'
            },
            {
                id   : 'workout',
                icon : '#workout',
                title: 'Work Out'
            }
        ]
    },
    {
        id: 'emotes',
        title: 'Emotes',
        icon: '#emotes',
        items: [
            {
                id   : 'salute',
                title: 'Salute',
                icon: '#salute'
            },
            {
                id   : 'dance',
                title: 'Dance',
                icon: '#dance'
            },
            {
                id   : 'middlefinger',
                title: 'Middle finger',
                icon: '#middlefinger'
            },
            {
                id   : 'handsup',
                icon : '#handsup',
                title: 'Hands up'
            },
            {
                id   : 'stop',
                icon : '#stop',
                title: 'Stop'
            },
            {
                id   : 'peace',
                icon : '#peace',
                title: 'Peace'
            }
        ]
    }
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var svgMenu;

window.onload = function () {
    svgMenu = new RadialMenu({
        parent      : document.body,
        size        : 400,
        closeOnClick: true,
        menuItems   : menuItems,
        onClick     : function (item) {
            console.log('You have clicked:', item.id, item.title);

            mp.trigger("clicked_category", item.id, item.title);  
        }
    });
 
    svgMenu.open();   
    //document.querySelector('body').style.display = 'block';
};

function open_menu()
{
    svgMenu.open();   

    document.querySelector('body').style.display = 'block';
} 

function execute_final_plm()
{ 
    svgMenu.show_final();   
    document.querySelector('body').style.display = 'block';
} 