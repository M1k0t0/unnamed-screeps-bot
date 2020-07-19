/* Version 0.1  Kagurazaka Mikoto<Mikoto@Sandmc.cc>
 * 
 *
 * Progress: 20%
 *
 *
 * README.md
 *
 * ? xxx
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// return;

console.log('global reset');

require('init');

module.exports.loop = function () {
    
    console.log('-----------------------------------------------------');
    
    global.towerTarget = {};
    
    let rooms_list=["YOUR-ROOM-NAME"];
    
    let cpuStartTime=Game.cpu.getUsed();
    
    for(var name in Memory.creeps) {
        let creep=Game.creeps[name];
        if(!creep) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }else{
            if(!Memory.rooms[creep.room.name]){
                console.log('[MemoryCtrl] Create new endpoint at /rooms/'+creep.room.name);
                Memory.rooms[creep.room.name]={};
            }
            if(Memory.rooms[creep.room.name].creep_num==undefined){
                Memory.rooms[creep.room.name].creep_num={total:1};
            }else{
                Memory.rooms[creep.room.name].creep_num.total+=1;
            }
            if(creep.memory.role!=undefined){
                if(Memory.rooms[creep.room.name]['creep_num'][creep.memory.role]==undefined){
                    Memory.rooms[creep.room.name]['creep_num'][creep.memory.role]=1;
                }else{
                    Memory.rooms[creep.room.name]['creep_num'][creep.memory.role]+=1;
                }
            }else{
                if(Memory.rooms[creep.room.name]['creep_num']['undefined']==undefined){
                    Memory.rooms[creep.room.name]['creep_num']['undefined']=1;
                }else{
                    Memory.rooms[creep.room.name]['creep_num']['undefined']+=1;
                }
            }
            
            if(creep.memory.role=='transporter') transporter.run(creep);
            if(creep.memory.role=='builder') builder.run(creep);
            if(creep.memory.role=='upgrader') upgrader.run(creep);
            if(creep.memory.role=='attacker') attacker.run(creep);
            
            /*
            catch(err){
                console.log('catch store prototype err');
            }
            */
        }
    }
    
    console.log('Creeps code CPU cost:'+(Game.cpu.getUsed() - cpuStartTime));
    
    cpuStartTime=Game.cpu.getUsed();
    
    for(let roomName of rooms_list){
        if(Memory['rooms'][roomName]==undefined){
            Memory['rooms'][roomName]={};
        }
        //new Hub(Game.rooms[roomName])
        
        let room=Game.rooms[roomName];
        
        if(!room) return;
        
        let controller=room.controller;
        let storage=room.storage;
        let terminal=room.terminal;
        let rcl=controller.level;
        
        let spawn0=Game.spawns[roomName+'_Spawn0'];
        if(!spawn0){
            if(Memory.rooms[roomName].spawn0){
                spawn0=Memory.rooms[roomName].spawn0;
                spawn0['break']=true;
            }else{
                return;
            }
        }else{
            if(!Memory.rooms[roomName].spawn0){
                Memory.rooms[roomName].spawn0={};
                Memory.rooms[roomName].spawn0.pos=spawn0.pos;
            }
            if(Game.time % 5 == 4 && room.find(FIND_HOSTILE_CREEPS,{
                filter: (hc)=>{
                    return hc.owner.username!="Invader" && hc.pos.inRangeTo(spawn0,5) && (hc.getActiveBodyparts(ATTACK) || hc.getActiveBodyparts(RANGED_ATTACK) || hc.getActiveBodyparts(WORK));
                }
            }).length) room.controller.activateSafeMode();
        }
        
        if(room.controller.level>=6 && Memory.rooms[roomName].links && !Memory.rooms[roomName].centerLink){
            for(let linkID of Memory.rooms[roomName].links.both){
                let link=Game.getObjectById(linkID);
                if(link && link.pos.inRangeTo(room.center,1)){
                    Memory.rooms[roomName].centerLink=linkID;
                    break;
                }
            }
        }else{
            if(!Game.getObjectById(Memory.rooms[roomName].centerLink)){
                Memory.rooms[roomName].centerLink=undefined;
            }
        }
        
        Memory.rooms[roomName].core=[spawn0.pos.x-2,spawn0.pos.y];
        
        if(Memory['rooms'][roomName]['matrixes']==undefined){
            Memory['rooms'][roomName]['matrixes']={};
        }
        if(Memory['rooms'][roomName]['autoplace']==undefined){
            Memory['rooms'][roomName]['autoplace']={};
        }
        if(Memory['rooms'][roomName]['links']==undefined){
            Memory['rooms'][roomName]['links']={};
            Memory['rooms'][roomName]['links']['in']=[];
            Memory['rooms'][roomName]['links']['out']=[];
            Memory['rooms'][roomName]['links']['both']=[];
        }
            
        function getAvaliableSpawn(pos){
            //console.log(pos)
            return pos.findClosestByRange(FIND_STRUCTURES,{
                filter:(structure) => {
                    return structure.structureType=='spawn' && structure.spawning==undefined;
                }
            })
        }

        for(let k in spawn_conf){
            // console.log(k)
            let conf=spawn_conf[k];
            if(!conf.spawn(roomName)){
                // console.log(k)
                continue;
            }
            
            if(Memory.rooms[roomName].creep_num && Memory.rooms[roomName].creep_num[conf.role]&&(conf.limit(roomName)<=Memory.rooms[roomName].creep_num[conf.role])){
                // console.log(conf.role+' rate limit');
                continue;
            }
            if(room.energyAvailable<conf.cost(roomName)){
                console.log("[SpawnLogic] Don't have enough energy to spawn "+conf.role);
                continue;
            }
            
            let body=conf.body(roomName);
            let cost=conf.cost(roomName);
            while(cost>0 && cost+conf.cost(roomName)<=room.energyAvailable && body.length+conf.body(roomName).length<=50){
                body=body.concat(conf.body(roomName));
                cost+=conf.cost(roomName);
            }
            // console.log(k)
            let workpos;
            if(!conf.workpos){
                workpos=new RoomPosition(25,25,roomName);
            }else{
                workpos=conf.workpos(roomName);
            }
            
            let spawn = getAvaliableSpawn(workpos);
            if(spawn){
                let status = spawn.spawnCreep(body,conf.name(roomName),{memory:{role:conf.role}});
                if(status==OK){
                    break;
                }else{
                    console.log('[SpawnLogic] '+roomName+' Error spawning '+conf.name(roomName)+'. code:'+status);
                    console.log(cost,body)
                }
            }
            
        }
        
        let gen_matrix=false;

        if(Memory['rooms'][roomName]['matrixes']['core']==undefined||Memory['rooms'][roomName]['rcl']==undefined||Memory['rooms'][roomName]['rcl']!=rcl){
            console.log('gen core matrix');
            gen_matrix=true;
            Memory.rooms[roomName].build=false;
            Memory['rooms'][roomName]['rcl']=rcl;
        }
        if(gen_matrix){
            var costs = new PathFinder.CostMatrix;
        }
        
        CONTROLLER_STRUCTURES['road']=[0,0,0,12,19,30,46,255,255];
        if(spawn0 && spawn0.pos.getRangeTo(controller)>17){
            CONTROLLER_STRUCTURES['link']=[0,0,0,0,0,0,0,1,4];
        }else{
            CONTROLLER_STRUCTURES['link']=[0,0,0,0,0,0,1,1,4];
        }
        
        /*
        CONTROLLER_STRUCTURES['road']=[0,0,0,10,17,28,42,54,255];
        if(spawn0.pos.getRangeTo(controller)>17){
            CONTROLLER_STRUCTURES['link']=[0,0,0,0,0,0,0,1,4];
        }else{
            CONTROLLER_STRUCTURES['link']=[0,0,0,0,0,0,1,1,4];
        }
        */
        
        room.visual.text(rcl,controller.pos.x,controller.pos.y+2);
        
        if(rcl && (gen_matrix || !Memory.rooms[roomName].build)){
            let limit;
            let jump=false;
            for(let s in roomPlan){
                limit=CONTROLLER_STRUCTURES[s][rcl];
                let pos_list=translater(spawn0.pos,roomPlan[s],startPos[s][0],startPos[s][1],limit,s);
                if(!Memory.rooms[roomName].build){
                    if(room.controller.level>=6){
                        let mineral=room.find(FIND_MINERALS);
                        if(mineral.length){
                            room.createConstructionSite(mineral[0],'extractor');
                        }
                    }
                    for(let i=0;i<limit;i++){
                        // if(s!='road' && room.lookForAt(LOOK_CREEPS,pos_list[i]).length){
                        //     jump=true;
                        //     continue;
                        // }
                        // 没必要
                        if(s!='spawn'){
                            room.createConstructionSite(pos_list[i],s);
                        }else{
                            if(Game.spawns[roomName+'_Spawn0'] && !Game.spawns[roomName+'_Spawn1']){
                                room.createConstructionSite(pos_list[i].x,pos_list[i].y,s,roomName+'_Spawn1');
                            }else if(Game.spawns[roomName+'_Spawn0'] && !Game.spawns[roomName+'_Spawn2']){
                                room.createConstructionSite(pos_list[i].x,pos_list[i].y,s,roomName+'_Spawn2');
                            }else{
                                room.createConstructionSite(pos_list[i].x,pos_list[i].y,s,roomName+'_Spawn0');
                            }
                        }
                    }
                }
                if(gen_matrix){
                    for(let i of pos_list){
                        if(!i){
                            break;
                        }
                        if(s!='road'){
                            costs.set(i.x,i.y,0xff);
                        }else{
                            costs.set(i.x,i.y,1);
                        }
                    }
                }
            }
            if(!jump){
                Memory.rooms[roomName].build=true;
            }
        }
        if(gen_matrix){
            Memory['rooms'][roomName]['matrixes']['core']=costs.serialize();
        }
        
        if(Memory['rooms'][roomName]['matrixes']['core']!=undefined){
            if(Memory['rooms'][roomName]['autoplace']['mine']==undefined){
                console.log('gen mine path');
                Memory['rooms'][roomName]['autoplace']['mine']=[];
                let costs = PathFinder.CostMatrix.deserialize(Memory['rooms'][roomName]['matrixes']['core']);
                let origin=new RoomPosition(spawn0.pos.x,spawn0.pos.y,roomName);
                
                let goals=[];
                for(let i of room.find(FIND_SOURCES)){
                    goals.push({pos:i.pos,range:1,rtype:'source'});
                }
                for(let i of room.find(FIND_MINERALS)){
                    goals.push({pos:i.pos,range:1,rtype:'mineral'});
                }
                
                for(let index in goals){
                    let goal=goals[index];
                    let ret = PathFinder.search(
                        origin, goal,
                        {
                            plainCost: 2,
                            swampCost: 10,
                    
                            roomCallback: function(roomName) {
                                return costs;
                            }
                        }
                    );
                    //console.log(JSON.stringify(ret));
                    
                    let endpoint=ret['path'].reverse()[0]
                    function getName(n,i){
                        if(!Game.flags[n]){
                            return n+i;
                        }else{
                            getName(n,i+1);
                        }
                    }
                    if(goal.rtype=='source'){
                        let flagName=roomName+'_source_'+index;
                        room.createFlag(endpoint.x,endpoint.y,flagName);
                    }
                    for(let p of ret['path']){
                        Memory['rooms'][roomName]['autoplace']['mine'].push(p);
                    }
                    
                }
            }
        }
        
        if(Memory['rooms'][roomName]['autoplace']['mine']){
            for(let p of Memory['rooms'][roomName]['autoplace']['mine']){
                room.visual.structure(p.x,p.y,'road');
                if(room.controller && room.controller.level>=3){
                    room.createConstructionSite(p.x,p.y,'road');
                }
            }
            room.visual.connectRoads();
        }
        
        if(Memory.rooms[roomName].updatePrototype){
            console.log('updatePrototype...');
            Memory.rooms[roomName].updatePrototype=false;
            try{
                room.update();
            }catch(e){
                console.log('[Caught] updateRoomStructure');
            }
        }
        /*
        Memory['rooms'][roomName]['rcl']++;
        if(Memory['rooms'][roomName]['rcl']>8){
            Memory['rooms'][roomName]['rcl']=0;
        }
        */
        
        
        for(let tower of room.tower){
            if(tower) TowerCtrl.run(tower);
        }
        
        if(room.controller.level>=6 && Memory.rooms[roomName].links && !Memory.rooms[roomName].links.both.length){
            for(let link of room.link){
                if(link.pos.x==Memory.rooms[roomName].core[0] && link.pos.y==Memory.rooms[roomName].core[1]+1){
                    Memory.rooms[roomName].links.both.push(link.id);
                    break;
                }
            }
        }
        
        if(Memory.rooms[roomName].centerLink && room.energyAvailable<room.energyCapacityAvailable*0.9){
            let link=Game.getObjectById(Memory.rooms[roomName].centerLink);
            if(link && link.store.energy<(link.store.getCapacity('energy')*0.5)){
                console.log('push task: storage -> centerLink (800 energy)');
                newTask(roomName,'storage',Memory.rooms[roomName].centerLink,'energy',800);
            }
        }
        
        LinkManager.run(roomName);
        
        Memory.rooms[roomName].creep_num=undefined;
        
    }
    
    console.log('Rooms code CPU cost:' + (Game.cpu.getUsed() - cpuStartTime));
    
    cpuStartTime=Game.cpu.getUsed();
    
    for(let flagName in Game.flags){
        let flag=Game.flags[flagName];
        let roomName=flag.pos.roomName;
        if(flagName.indexOf('_source_')!=-1 && rooms_list.indexOf(flag.pos.roomName)!=-1){
            flag.setColor(COLOR_YELLOW,COLOR_YELLOW);
        }
        if(flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_YELLOW){
            SourceKeeperCtrl.run(flag);
        }
        if(flag.name.indexOf('_outpost_')!=-1){
            OutPostCtrl.run(flag);
            
            let home=flag.memory.home;
            
            if(Memory['rooms'][home]['matrixes']['core']!=undefined && Game.rooms[flag.memory.home] && Game.rooms[flag.memory.home].controller.level>=3){
                if(Game.time%3000==0 || !flag.memory.n){
                    console.log('[Outpost] (re)gen '+flag.name+' outpost path');
                    
                    let costs = PathFinder.CostMatrix.deserialize(Memory['rooms'][home]['matrixes']['core']);
                    let origin=new RoomPosition(Memory.rooms[home].core[0],Memory.rooms[home].core[1],home);
                    
                    let goal={pos:flag.pos,range:1};
                    

                    let ret = PathFinder.search(
                        origin, goal,
                        {
                            plainCost: 2,
                            swampCost: 10,
                    
                            roomCallback: function(roomName) {
                                if(roomName==home){
                                    for(let road of Game.rooms[roomName].road){
                                        costs.set(road.pos.x,road.pos.y,1);
                                    }
                                    return costs;
                                }else{
                                    let ncosts=new PathFinder.CostMatrix;
                                    if(Game.rooms[roomName]){
                                        for(let road of Game.rooms[roomName].road){
                                            ncosts.set(road.pos.x,road.pos.y,1);
                                        }
                                    }
                                    return ncosts;
                                }
                            }
                        }
                    );
                    let clear=[];
                    for(let p of ret['path']){
                        let room=Game.rooms[p['roomName']];
                        
                        if(clear.indexOf(p['roomName'])==-1){
                            if(!flag.memory.autoplace){
                                flag.memory.autoplace={};
                            }
                            flag.memory.autoplace[p['roomName']]=[];
                            clear.push(p['roomName']);
                        }
                        
                        flag.memory.n=1;
                        if(room){
                            room.visual.structure(p.x,p.y,p['roomName']);
                            room.createConstructionSite(p.x,p.y,'road');
                        }else{
                            if(!flag.memory.autoplace[p['roomName']]){
                                flag.memory.autoplace[p['roomName']]=[];
                            }
                            flag.memory.autoplace[p['roomName']].push([p.x,p.y]);
                        }
                    }
                }
            }
        }
    }
    
    console.log('Flags code CPU cost:' + (Game.cpu.getUsed() - cpuStartTime));
    
    console.log('-----------------------------------------------------');
    
    centerTransfer.run();
    
    Visualizer.visuals();
}