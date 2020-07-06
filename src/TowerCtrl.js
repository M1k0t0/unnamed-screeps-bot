var TowerCtrl = {
    run: function(tower){

        let towerTarget=global.towerTarget;
        //console.log(tower)
        if(!tower){
            return;
        }
        var healer=false;
        var partnum=0;
        const roomName=tower.room.name;
        var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hits < creep.hitsMax;
            }
        });
        if(closestDamagedCreep){
            tower.heal(closestDamagedCreep);
        }
        var closestDamagedPC = tower.pos.findClosestByRange(FIND_MY_POWER_CREEPS, {
            filter: (creep) => {
                return creep.hits < creep.hitsMax;
            }
        });
        if(closestDamagedPC){
            tower.heal(closestDamagedPC);
        }
        //console.log(towerTarget[roomName]);
        let find=false;
        if(towerTarget[roomName]===undefined){
            find=true;
        }
        //console.log(find);
        //(!Memory.rooms[roomName].defence)
        //if((||(Memory.rooms[roomName].defence.raer_num!=1 || Memory.rooms[roomName].defence.atker_num!=0))){
            
            if(!find && towerTarget && towerTarget[roomName] && towerTarget[roomName].id!=undefined){
                var closestHostile = Game.getObjectById(towerTarget[roomName].id);
                if(!closestHostile || closestHostile.hits>towerTarget[roomName].hits){
                    //Memory.rooms[tower.room.name].tower.target=undefined;
                    closestHostile=null;
                }
            }else if(!closestHostile){
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
                    filter:(creep) => {
                        creep.body.forEach(part => {
                            if(part.type=='heal'){
                                healer=true;
                                partnum++;
                            }
                        });
                        if(healer){
                            healer=false;
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                });
            }
    
            if(!closestHostile){
                var worker=false;
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
                    filter:(creep) => {
                        creep.body.forEach(part => {
                            if(part.type=='ranged_attack'){
                                worker=true;
                            }
                        });
                        if(worker){
                            worker=false;
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                });
            }
            if(!closestHostile){
                if(Game.time%12==0 && towerTarget[roomName]){
                    towerTarget[roomName].hits=5000;
                }
                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
                    filter:(cp) => {
                        if(!towerTarget[roomName]){
                            return true;
                        }
                        if(towerTarget[roomName].id){
                            return cp.id!=towerTarget[roomName].id;
                        }
                    }
                });
            }
            if(closestHostile) {
                let attack=true;
                if(Memory.rooms[roomName].defence && Memory.rooms[roomName].defence.onlineDefender.length){
                    attack=false;
                }
                    /*
                    if(closestHostile.getActiveBodyparts(RANGED_ATTACK) && Memory.rooms[roomName].defence.defender_atker_num>=Memory.rooms[roomName].defence.onlineDefender.length){
                        Memory.attack=true;
                    }
                    */
                let eventLog = tower.room.getEventLog();
                let attackEvents = _.filter(eventLog, {event: EVENT_ATTACK});
                for(let i of attackEvents){
                    let cp=Game.getObjectById(i.objectId);
                    let target=Game.getObjectById(i.data.targetId);
                    if(cp && cp.my && cp.ticksToLive!=undefined && target &&!target.my){
                        if(target.hits<target.hitsMax*0.5){
                            towerTarget[roomName]=target;
                        }
                        attack=true;
                        closestHostile=target;
                        break;
                    }
                }
                //Memory.attack=true;
                if(attack){
                    towerTarget[roomName]=closestHostile;
                    if(tower.store.energy<550){
                        if(tower.pos.inRangeTo(closestHostile,18)){
                            tower.attack(closestHostile);
                        }
                    }else if(tower.store.energy<380){
                        if(tower.pos.inRangeTo(closestHostile,12)){
                            tower.attack(closestHostile);
                        }
                    }else{
                        tower.attack(closestHostile);
                    }
                    towerTarget[roomName]=closestHostile;
                }
            }else{
                towerTarget[roomName]=null;
            //}
        //}else{
            //console.log(1)
                var closestDamagedStructure;
                let eventLog = tower.room.getEventLog();
                let attackEvents = _.filter(eventLog, {event: EVENT_ATTACK});
                let dList=[];
                for(let i of attackEvents){
                    let cp=Game.getObjectById(i.objectId);
                    let t=Game.getObjectById(i.data.targetId);
                    if(cp && !cp.my && cp.ticksToLive!=undefined && t && t.my){
                        
                        //closestDamagedStructure=t;
                        dList.push(t);
                        //break;
                    }
                }
                dList=dList.sort((a,b)=>{return a.hits-b.hits})
                //dList.reverse();
                //console.log(JSON.stringify(dList));
                if(dList.length){
                    closestDamagedStructure=dList[0];
                    //console.log(closestDamagedStructure)
                }
                if(!closestDamagedStructure){
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART && structure.hits<301)||(structure.structureType == STRUCTURE_ROAD && structure.hits<5000);
                        }
                    });
                }
                if(!closestDamagedStructure){
                    if(tower.room.controller.level==8){
                        //console.log(tower.room.controller.level)
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_RAMPART && structure.hits<200000) 
                                || (structure.structureType == STRUCTURE_WALL && structure.hits<200000)
                                || (structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL && structure.hits <structure.hitsMax);
                            }
                        });
                    }else{
                        //console.log(3)
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_RAMPART && structure.hits<200000) 
                                || (structure.structureType == STRUCTURE_WALL && structure.hits<200000)
                                || (structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_WALL && structure.hits <structure.hitsMax);
                            }
                        });
                    }
                }
                if(closestDamagedStructure) {
                    //console.log(closestDamagedStructure)
                    try{
                        tower.repair(closestDamagedStructure);
                    }catch(e){
                        console.log(e);
                    }
                }
            }
    }
};
module.exports = TowerCtrl;