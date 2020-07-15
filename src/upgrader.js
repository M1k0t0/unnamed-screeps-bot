var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.Transfer){
            creep.memory.no_pull=false;
            creep.moveTo(creep.room.controller,{range:1,visualizePathStyle: {stroke: '#FF0000'}});
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.say('Upgrader');
            }
            else{
                if(creep.pos.inRangeTo(creep.room.controller,1)) creep.memory.no_pull=true;
                else creep.memory.no_pull=false;
                creep.say('⚠️ '+creep.store.energy+'/'+creep.store.getCapacity());
            }
            if(!creep.store.energy) creep.memory.Transfer=false;
        }
        if(!creep.memory.Transfer){
            
            if(creep.store.energy>=creep.store.getCapacity()*0.85){
                creep.memory.Transfer=true;
                creep.moveTo(creep.room.controller);
            }
            
            creep.memory.no_pull=false;
            creep.say('W:'+creep.store.energy);
            const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                filter:(r)=>{
                    if(creep.room.controller && creep.room.controller.level<=3){
                        return r.amount>200 
                        && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),20);
                    }
                    return r.amount>creep.store.getFreeCapacity() 
                    && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),15);
                }
            });
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }else{
                const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy>creep.store.getFreeCapacity('energy');
                    }
                });
                if(target) {
                    if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }else{
                    // if(creep.room.controller && creep.room.controller.level>4){
                    //     for(let linkID of Memory.rooms[creep.room.name].links.in){
                    //         let link=Game.getObjectById(linkID);
                    //         if(link.pos.inRangeTo(creep.room.center,4)) continue;   // max range 6
                    //         if(link && link.store.energy){
                    //             let state=creep.withdraw(link,RESOURCE_ENERGY);
                    //             if(state == ERR_NOT_IN_RANGE) {
                    //                 creep.moveTo(link);
                    //             }else if(state == OK){
                    //                 if(creep.store.energy+link.store.energy>=creep.store.getCapacity()*0.8){
                    //                     creep.memory.Transfer=true;
                    //                 }
                    //             }
                    //             return;
                    //         }
                    //     }
                    // }
                    const storage = creep.room.storage;
                    if(storage && storage.store.energy>25000){
                        if(creep.withdraw(storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.say('withdraw()');
                            creep.moveTo(storage,{visualizePathStyle: {stroke: '#FFFF00'}});
                        }
                        return;
                    }else{
                        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        if(source){
                            creep.memory.no_pull=true;
                            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                creep.say('Harvesting');
                                creep.moveTo(source,{visualizePathStyle: {stroke: '#FFFF00'}});
                            }
                            else{
                                creep.say('⚙️ '+creep.carry.energy+'/'+creep.carryCapacity);
                            }
                        }
                    }
                }
            }
        }
	}
};

module.exports = roleUpgrader;