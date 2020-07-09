require('prototype.Room.structures');
require('prototype.Creep.move');
require('prototype.Whitelist')
require('prototypes');

global.roomPlan={
    'extension':[
      [61,-1,-1,56,-1,-1, 60, -1,-1,55,-1,  -1,62],
      [-1,32,31,-1,28,27 ,-1,23,22,-1,18,  17,-1],
      [-1,33,-1,30,29,-1,-1,  -1,21,20,-1, 16,-1],
      [57,-1,35,34,-1,26,25,24,-1,19, 15, -1,59],
      [-1,37,36,-1, -1,-1,-1,-1, -1, -1, 14, 13,-1],
      [-1,38,-1 ,39,-1,-1,-1,-1, -1,  0,  -1,  3, -1],
      [53, -1,-1, 40,-1,-1,-1,-1, -1,  1,  -1,-1,54],
      [-1,42,-1, 41,-1,-1,-1,-1, -1,  2,  -1,  4,-1],
      [-1,43,44, -1,-1,-1,-1,-1, -1, -1,   6,  5,-1],
      [58,-1,45, 49,-1,-1,-1,-1, -1,  8,   7, -1,60],
      [-1,46,-1, 50,-1,-1,-1,-1, -1,  9,  -1,10,-1],
      [-1,47,48, -1,-1,-1, -1,-1,-1, -1,  12,11,-1],
      [63,-1 ,-1,51, -1,-1,65,-1, -1,52, -1, -1,64]
    ],
    'lab':[
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1, 3, 4, 5,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1, 6,-1, 1,-1, 8,-1,-1,-1,-1],
      [-1,-1,-1,-1, 7, 0,-1, 2, 9,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    ],
    'spawn':[
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1, 2,-1,-1,-1, 0,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ],
    'powerSpawn':[
      [0]
    ],
    'tower':[
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1, 3,-1,-1,-1, 2,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1, 4,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1, 5,-1,-1,-1, 1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ],
    'storage':[
        [0]
    ],
    'link':[
        [2],
        [],
        [],
        [1],
        [],
        [],
        [],
        [0],
        [],
        [],
        [],
        [],
        [3]
    ],
    'terminal':[
        [0]
    ],
    'factory':[
        [0]
    ],
    'nuker':[
        [0]
    ],
    'observer':[
        [0]
    ],
    'road':[
      [-1,-1,-1,-1,28,27,-1,25,23,-1,-1,-1,-1],
      [-1,-1,-1,33,-1,-1,26,-1,-1,18,-1,-1,-1],
      [-1,-1,34,-1,-1,29,-1,24,-1,-1,17,-1,-1],
      [-1,35,-1,-1,30,-1,-1,-1,19,-1,-1,16,-1],
      [36,-1,-1,31,-1,55,-1,21,-1, 1,-1,-1,15],
      [37,-1,32,-1,57,56,-1,13, 0,-1, 2,-1,14],
      [-1,38,-1,-1,-1,-1,-1,-1,-1,-1,-1, 3,-1],
      [46,-1,39,-1,60,58,-1,12,11,-1, 4,-1, 6],
      [47,-1,-1,40,-1,59,-1,22,-1, 5,-1,-1, 7],
      [-1,48,-1,-1,41,-1,-1,-1,45,-1,-1, 8,-1],
      [-1,-1,49,-1,-1,42,-1,44,-1,-1, 9,-1,-1],
      [-1,-1,-1,50,-1,-1,43,-1,-1,10,-1,-1,-1],
      [-1,-1,-1,-1,51,52,-1,53,54,-1,-1,-1,-1]
    ]
};
global.startPos={
    'extension':[6,8],
    'lab':[6,8],
    'spawn':[6,8],
    'powerSpawn':[-2,2],
    'tower':[6,8],
    'storage':[0,2],
    'link':[6,2],
    'terminal':[0,1],
    'factory':[1,2],
    'nuker':[0,3],
    'observer':[4,2],
    'road':[6,8]
};

let tmpObj={
    SourceKeeperCtrl:require('SourceKeeperCtrl'),
    OutPostCtrl:require('OutPostCtrl'),
    LinkManager:require('linkManager'),
    TowerCtrl:require('TowerCtrl'),
    Visualizer:require('Visualizer'),
    transporter:require('transporter'),
    builder:require('builder'),
    upgrader:require('upgrader')
};
global=Object.assign(tmpObj,global);

// global.SourceKeeperCtrl = require('SourceKeeperCtrl');
// global.OutPostCtrl = require('OutPostCtrl');
// global.transporter = require('transporter');
// global.builder = require('builder');
// global.upgrader = require('upgrader');
// global.Visualizer = require('Visualizer');

global.spawn_conf={
    'transporter':{
        'role':'transporter',
        'name':(roomName)=>{ 
            if(!Memory.rooms[roomName]['creep_num'] || !Memory.rooms[roomName]['creep_num']['transporter']){
                return roomName+'_Transporter_0';
            }
            let c=Game.creeps[roomName+'_Transporter_'+Memory.rooms[roomName]['creep_num']['transporter']];
            let n=Memory.rooms[roomName]['creep_num']['transporter']
            while(c&&n>=0){
                n--;
                c=Game.creeps[roomName+'_Transporter_'+n];
            }
            return roomName+'_Transporter_'+n; 
        },
        'limit':(roomName)=>{ 
            let rcltl=[0,4,3,3,2,2,2,2,2];
            return rcltl[Game.rooms[roomName].controller.level];
        },
        'spawn': (roomName)=>{ 
            if(Game.rooms[roomName].controller && Game.rooms[roomName].controller.level<3 && !Memory.rooms[roomName]['creep_num']){
                return false;
            }
            if(!Game.creeps[roomName+'_Transporter_0']){
                return Game.rooms[roomName].energyAvailable>=300; 
            }
            //console.log(1)
            //console.log(Game.rooms[roomName].energyAvailable,Game.rooms[roomName].energyCapacityAvailable*0.5)
            if(Game.rooms[roomName].controller && Game.rooms[roomName].controller.level>=4){
                return Game.rooms[roomName].energyAvailable>=Game.rooms[roomName].energyCapacityAvailable*0.5;
            }
            return true;
        },
        'workpos': null,
        'body':(roomName)=>{
            if(Game.rooms[roomName].controller.level<3){
                return [MOVE,CARRY];
            }
            return [MOVE,CARRY,CARRY];
        },
        'cost':(roomName)=>{
            if(Game.rooms[roomName].controller.level<3){
                return 100;
            }
            return 150;
        }
    },
    'upgrader':{
        'role':'upgrader',
        'name':(roomName)=>{ return roomName+'_Upgrader_'+Game.time; },
        'limit':(roomName)=>{ 
            let rcltl=[0,6,6,6,4,3,5,4,1];
            if(Game.rooms[roomName].storage && Game.rooms[roomName].storage.store.energy>400000 && Game.rooms[roomName].controller.level<8 && Game.rooms[roomName].controller.level>0){
                return rcltl[Game.rooms[roomName].controller.level]+1;
            }
            return rcltl[Game.rooms[roomName].controller.level];
        },
        'spawn': (roomName)=>{ 
            if(Game.rooms[roomName].controller && Game.rooms[roomName].controller.ticksToDowngrade<CONTROLLER_DOWNGRADE[Game.rooms[roomName].controller.level]/5){
                return true;
            }
            if(Game.rooms[roomName].controller && Game.rooms[roomName].controller.level<=3){
                if(!Memory.rooms[roomName]['creep_num']){
                    return false;
                }
                return Game.rooms[roomName].energyAvailable>=300; 
            }
            if(Game.rooms[roomName].storage){
                return Game.rooms[roomName].energyAvailable>=Game.rooms[roomName].energyCapacityAvailable*0.5 && Game.rooms[roomName].storage.store.energy>50000;
            }
            return Game.rooms[roomName].energyAvailable>=Game.rooms[roomName].energyCapacityAvailable*0.8;
        },
        'workpos': (roomName)=>{ return Game.rooms[roomName].controller.pos },
        'body':(roomName)=>{
            if(Game.rooms[roomName].controller.level<4){
                return [WORK,MOVE,MOVE,CARRY];
            }
            if(Game.rooms[roomName].controller.level<6){
                return [WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY];
            }
            if(Game.rooms[roomName].controller.level<8){
                return [WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY];
            }
            return [WORK,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
        },
        'cost':(roomName)=>{
            if(Game.rooms[roomName].controller.level<4){
                return 250;
            }
            if(Game.rooms[roomName].controller.level<6){
                return 600;
            }
            if(Game.rooms[roomName].controller.level<8){
                return 650;
            }
            return 650;
        }
    },
    'builder':{
        'role':'builder',
        'name':(roomName)=>{ return roomName+'_Builder_'+Game.time; },
        'limit':(roomName)=>{ 
            let rcltl=[0,0,4,4,4,3,3,2,1];
            return rcltl[Game.rooms[roomName].controller.level];
        },
        'spawn': (roomName)=>{ 
            if(Game.rooms[roomName].controller && Game.rooms[roomName].controller.level<3 && !Memory.rooms[roomName]['creep_num']){
                return false;
            }
            return Game.time%30 && Game.rooms[roomName].energyAvailable>=300 && Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).length; 
        },
        'workpos': null,
        'body':(roomName)=>{
            if(Game.rooms[roomName].controller.level<4){
                return [WORK,MOVE,MOVE,CARRY];
            }
            if(Game.rooms[roomName].controller.level<6){
                return [WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY];
            }
            if(Game.rooms[roomName].controller.level<=8){
                return [WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY];
            }
        },
        'cost':(roomName)=>{
            if(Game.rooms[roomName].controller.level<4){
                return 250;
            }
            if(Game.rooms[roomName].controller.level<6){
                return 600;
            }
            if(Game.rooms[roomName].controller.level<=8){
                return 650;
            }
        }
    }
}

//pos list m n limit
global.translater = function(p,l,m,n,t=250,type=''){
    let pos_list=[];
    let roomName=p.roomName;
    for(let i=0;i<250;i++){
        pos_list.push(null);
    }
    for(let i=0;i<l.length;i++){
        for(let j=0;j<l[i].length;j++){
            if(l[i][j]<0) continue;
            //console.log(j-n,i-m);
            let np=new RoomPosition(p.x+j-n,p.y+i-m,roomName);
            pos_list[l[i][j]]=np;
            if(l[i][j]<t){
                if(type){
                    Game.rooms[roomName].visual.structure(np.x,np.y,type);
                }else{
                    Game.rooms[roomName].visual.circle(np);
                }
            }
        }
    }
    Game.rooms[roomName].visual.connectRoads();
    return pos_list;
}

global.pushTask = function(roomName,from,to,resourceType,amount){
    if(!roomName){
        return undefined;
    }
    if(from=='storage'){
        from=Game.rooms[roomName].storage.id;
    }else if(from=='terminal'){
        from=Game.rooms[roomName].terminal.id;
    }else if(from=='factory'){
        from=Game.rooms[roomName].factory.id;
    }
    
    if(to=='terminal'){
        to=Game.rooms[roomName].terminal.id;
    }else if(to=='storage'){
        to=Game.rooms[roomName].storage.id;
    }else if(to=='factory'){
        to=Game.rooms[roomName].factory.id;
    }
    if(!from || !to || !resourceType){
        return undefined;
    }
    if(resourceType=='all'){
        let n=0;
        for(let r in Game.getObjectById(from).store){
            let a=Game.getObjectById(from).store[r];
            if(a){
                n++;
                if(Memory.tasks[roomName][0].indexOf('Custom    F:'+from+'T:'+to+'R:'+r)==-1){
                    Memory.tasks[roomName][0].push('Custom    F:'+from+'T:'+to+'R:'+r);
                    Memory.tasks[roomName][1]['Custom    F:'+from+'T:'+to+'R:'+r]={from:from,to:to,resourceType:r,amount:a,id:'Custom    F:'+from+'T:'+to+'R:'+r};
                }
            }
        }
        return 'Successfully add '+n+' tasks';
    }else if(!amount){
        return undefined;
    }
    if(Memory.tasks[roomName]==undefined) Memory.tasks[roomName]=[[],{}];
    if(Memory.tasks[roomName][0].indexOf('Custom    F:'+from+'T:'+to+'R:'+resourceType)==-1){
        Memory.tasks[roomName][0].push('Custom    F:'+from+'T:'+to+'R:'+resourceType);
        Memory.tasks[roomName][1]['Custom    F:'+from+'T:'+to+'R:'+resourceType]={from:from,to:to,resourceType:resourceType,amount:amount,id:'Custom    F:'+from+'T:'+to+'R:'+resourceType};
        return JSON.stringify(Memory.tasks[roomName][1]);
        return true;
    }else{
        return false;
    }
}
global.getClosestRoom = function(roomName){
    let roomRange={};
    for(let rn in Game.rooms){
        let room=Game.rooms[rn];
        if(room.name==roomName){
            continue;
        }
        if(room.controller && room.controller.my){
            roomRange[Game.map.getRoomLinearDistance(roomName,room.name)]=room.name;
        }
    }
    Object.keys(roomRange).sort();
    return Object.values(roomRange)[0];
}
global.clearCS = function(){
    for(let c in Game.constructionSites){
        Game.constructionSites[c].remove();
    }
}

if(Memory['rooms']==undefined){
    Memory['rooms']={};
    console.log('[MemoryCtrl] Create new endpoint at /rooms');
}
if(Memory['tasks']==undefined){
    Memory['tasks']={};
    console.log('[MemoryCtrl] Create new endpoint at /tasks');
}