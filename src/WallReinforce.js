/*
 * 刷墙工 v0.1
 * 传参格式: (房间名, 是否刷人工墙, 人工墙目标血量, 城墙目标血量)
 *                       默认刷      默认3m hits     默认3m hits
 *
 * 功能:
    * [√] 自动刷墙并维持血量
    * [√] 双阶段刷墙，降低血量差距
    * [x] 自动扛核
 */

module.exports = {
    run: function(roomName,w=true,wl=3000000,rl=3000000){
        if(!Game.rooms[roomName]){
            return;
        }
        if(Game.creeps[roomName+'_Repair_0']){
            main(Game.creeps[roomName+'_Repair_0'],w,wl,rl);
        }
        if(Game.creeps[roomName+'_Repair_1']){
            main(Game.creeps[roomName+'_Repair_1'],w,wl,rl);
        }
        let needSpawn=false;
        if(!Memory.rooms[roomName].WallReinforce && Game.time%40==0){
            let target=Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if(w){
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.7)
                        || (structure.structureType == STRUCTURE_WALL && structure.hits < wl*0.7);
                    }
                    return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.7);
                }
            });
            if(target.length){
                console.log(roomName+' WallReinforce start.')
                Memory.rooms[roomName].WallReinforce=true;
                needSpawn=true;
            }
            // else{
            //     let nonMax=Game.rooms[roomName].find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             if(w){
            //                 return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.97)
            //                 || (structure.structureType == STRUCTURE_WALL && structure.hits < wl*0.97);
            //             }
            //             return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.97);
            //         }
            //     });
            //     if(nonMax.length==0){
            //         Memory.rooms[roomName].WallReinforce=false;
            //     }
            // }
        }else if(Game.time%20==0){
            let nonMax=Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if(w){
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.97)
                        || (structure.structureType == STRUCTURE_WALL && structure.hits < wl*0.97);
                    }
                    return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.97);
                }
            });
            if(nonMax.length==0){
                Memory.rooms[roomName].WallReinforce=false;
                needSpawn=false;
                console.log(roomName+' WallReinforce finish.')
            }else{
                //console.log(roomName+' WallReinforcing.')
                needSpawn=true;
            }
        }
        //console.log('[WallReinforce] Debug: Game.time='+Game.time+' '+Game.time % 20==0)
        if(needSpawn){
            var spawn = getAvaliableSpawn(roomName);
            if(spawn){
                //这里的body如不满意可以自行调整
                var baseBody = [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY],baseCost = 650;
                var body = [],cost = 0;
                while(cost + baseCost < Game.rooms[roomName].energyCapacityAvailable*0.8 && body.length + baseBody.length <= 50){
                    cost += baseCost;
                    body = body.concat(baseBody);
                }
                if(Game.creeps[roomName+'_Repair_0']){
                    if(Game.rooms[roomName].energyAvailable>=Game.rooms[roomName].energyCapacityAvailable*0.6){
                        spawn.spawnCreep(body,roomName+'_Repair_1',{memory:{dontheal:true}});
                    }
                }else{
                    spawn.spawnCreep(body,roomName+'_Repair_0',{memory:{dontheal:true}});
                }
            }
        }
        
    }
};
function main(creep,w,wl,rl){
    //console.log(w,wl,rl);
    if(creep.memory.work && creep.store.energy == 0) {
        creep.memory.work = false;
        creep.say('🔄 getEnergy');
    }

    if(!creep.memory.work && creep.store.energy == creep.store.getCapacity('energy')) {
        creep.memory.work = true;
        creep.say('🚧 repair');
    }
    
    if(creep.memory.work){
        creep.say('repairing');
        if(creep.room.find(FIND_HOSTILE_CREEPS).length){
            let eventLog = creep.room.getEventLog();
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
                if((dList[0].structureType=='wall' && dList[0].hits<wl/2) || (dList[0].structureType=='rampart' && dList[0].hits<rl/2)){
                    creep.memory.target=dList[0].id;
                }
                if(creep.repair(dList[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dList[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
                else{
                    creep.say('⚠️ '+creep.store.energy+'/'+creep.store.getCapacity());
                }
                //console.log(closestDamagedStructure)
            }
        }
        if(!creep.memory.safe){
            var s=Game.getObjectById(creep.memory.target);
            if(!s){
                s = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if(w){
                            return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.3)
                            || (structure.structureType == STRUCTURE_WALL && structure.hits < wl*0.3);
                        }
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl*0.3);
                    }
                });
            }
            if(s){
                if((s.structureType == STRUCTURE_RAMPART && s.hits > rl*0.3) || (s.structureType == STRUCTURE_WALL && s.hits > wl*0.3)){
                    creep.memory.target=null;
                    return;
                }
                creep.memory.target=s.id;
                if(creep.repair(s) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(s, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else{
                    creep.say('⚠️ '+creep.store.energy+'/'+creep.store.getCapacity());
                }
            }else{
                creep.memory.safe=true;
            }
            return;
        }
        var s=Game.getObjectById(creep.memory.target);
        if(!s){
            s = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if(w){
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl)
                        || (structure.structureType == STRUCTURE_WALL && structure.hits < wl);
                    }
                    return (structure.structureType == STRUCTURE_RAMPART && structure.hits < rl);
                }
            });
        }
        if(s){
            if((s.structureType == STRUCTURE_RAMPART && s.hits > rl) || (s.structureType == STRUCTURE_WALL && s.hits > wl)){
                creep.memory.target=null;
                return;
            }
            creep.memory.target=s.id;
            if(creep.repair(s) == ERR_NOT_IN_RANGE) {
                creep.moveTo(s, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else{
                creep.say('⚠️ '+creep.store.energy+'/'+creep.store.getCapacity());
            }
        }
    }else{
        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy>creep.store.getCapacity()*0.7;
            }
        });
        if(target) {
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else{
            const target=creep.room.storage;
            if(target&&target.store.energy>50000){

                if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    return;
                }

            }else{
                const target=creep.room.terminal;
                if(target&&target.store.energy>60000){
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
        }
    }
}
function getAvaliableSpawn(roomName){
    if(!Game.rooms[roomName]){
        return null;
    }
    for (let spawn of Game.rooms[roomName].spawns){
        if(spawn.spawning == null){
            return spawn
        }
    }
    return null;
}