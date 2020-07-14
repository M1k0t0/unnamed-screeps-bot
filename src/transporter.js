var Transporter = {
    run: function(creep){
        var storeAll=creep.store.getUsedCapacity();
        var otherThings=false;
        if(creep.store.energy<storeAll){
            otherThings=true;
        }
        if(creep.isEmpty){
            creep.memory.Transfer=false;
        }else if(creep.isFull){
            creep.memory.Transfer=true;
        }
        
        if(!creep.memory.Transfer) {
            creep.say('W:'+creep.store.energy);
            if(creep.ticksToLive<=2){
                creep.say('bye');
                return;
            }
            
            if(!Memory.rooms[creep.room.name].invade){
                const tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES,{
                    filter:(r)=>{
                        if(creep.room.controller && creep.room.controller.level<3){
                            return (r.store.energy>150 || r.store.energy>=creep.store.getFreeCapacity(r.resourceType)) && r.pos.inRangeTo(creep,20);
                        }
                        return r.store.getUsedCapacity() && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),20);
                    }
                });
                if(tombstone) {
                    for(let rt in tombstone.store){
                        if(!creep.room.storage && rt!=RESOURCE_ENERGY) continue;
                        if(creep.withdraw(tombstone,rt) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tombstone);
                        }else{
                            creep.memory.no_pull=true;
                        }
                        return;
                    }
                }
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                    filter:(r)=>{
                        if(creep.room.controller && creep.room.controller.level<=3){
                            return r.amount>creep.store.getFreeCapacity()/2 && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),25);
                        }else if(creep.room.controller && creep.room.controller.level<=5){
                            return r.amount>creep.store.getFreeCapacity() && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),20);
                        }
                        return r.amount>creep.store.getFreeCapacity() && r.pos.inRangeTo(new RoomPosition(Memory.rooms[creep.room.name].core[0],Memory.rooms[creep.room.name].core[1],creep.room.name),15);
                    }
                });
                if(target) {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        //creep.say(Game.creeps['W44S1_Transporter_0'].memory.no_pull);
                        creep.moveTo(target);
                    }
                    return;
                }
            }else{
                if(creep.room.controller && creep.room.controller.level<3){
                    creep.suicide();
                }
            }
            if(creep.room.controller && creep.room.controller.level>4){
                for(let linkID of Memory.rooms[creep.room.name].links.in){
                    let link=Game.getObjectById(linkID);
                    if(!link.pos.inRangeTo(creep.room.center,5)) continue;   // max range 17
                    if(link && link.store.energy){
                        let state=creep.withdraw(link,RESOURCE_ENERGY);
                        if(state == ERR_NOT_IN_RANGE) {
                            creep.moveTo(link);
                        }else if(state == OK){
                            if(creep.store.energy+link.store.energy>=creep.store.getCapacity()*0.8){
                                creep.memory.Transfer=true;
                            }
                        }
                        return;
                    }
                }
                for(let linkID of Memory.rooms[creep.room.name].links.both){
                    //console.log(linkID);
                    let link=Game.getObjectById(linkID);
                    if(link && link.store.energy){
                        let state=creep.withdraw(link,RESOURCE_ENERGY);
                        if(state == ERR_NOT_IN_RANGE) {
                            creep.moveTo(link);
                        }else if(state == OK){
                            if(creep.store.energy+link.store.energy>=creep.store.getCapacity()*0.8){
                                creep.memory.Transfer=true;
                            }
                        }
                        return;
                    }
                }
            }
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy>creep.store.getFreeCapacity('energy')*0.7;
                }
            });
            if(target) {
                let state=creep.withdraw(target,RESOURCE_ENERGY);
                if(state == OK){
                    if(target.store.energy>=creep.store.getFreeCapacity()){
                        creep.memory.Transfer=true;
                    }
                }else if(state == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }else{
                    if(creep.room.controller.level>=4){
                        if(creep.room.storage && creep.room.storage.store.getFreeCapacity()){
                            const dtarget = creep.pos.findInRange(FIND_DROPPED_RESOURCES,6);
                            if(dtarget.length) {
                                //console.log(1)
                                //creep.memory.no_pull=true;
                                let state=creep.pickup(dtarget[0]);
                                
                                if(state == OK && dtarget[0].store.energy>=creep.store.getFreeCapacity()){
                                    creep.memory.Transfer=true;
                                }
                            }
                        }
                    }else{
                        const dtarget = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1);
                        if(dtarget.length) {
                            //console.log(1)
                            //creep.memory.no_pull=true;
                            let state=creep.pickup(dtarget[0]);
                                
                            if(state == OK && dtarget[0].store.energy>=creep.store.getFreeCapacity()){
                                creep.memory.Transfer=true;
                            }
                        }
                    }
                }
            }else{
                const target=creep.room.storage;
                if(target&&target.store.energy){
                    
                    let state = creep.withdraw(target,RESOURCE_ENERGY);
                    
                    if(state == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }else if(state == OK){
                        if(target.store.energy>=creep.store.getFreeCapacity()){
                            creep.memory.Transfer=true;
                        }
                    }
                    
                }else{
                    const target=creep.room.terminal;
                    if(target&&target.store.energy>40000){
                        if(target.store.energy>=creep.store.getFreeCapacity()){
                            creep.memory.Transfer=true;
                        }
                        if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
            }
            
        }
        if(creep.memory.Transfer) {
            
            if(otherThings){
                const storage = creep.room.storage;
                if(storage){
                    if(storeAll<storage.store.getFreeCapacity()){
                        for(let r of creep.storeList){
                            if(creep.transfer(storage, r) == ERR_NOT_IN_RANGE) {
                                if(Game.time % 2){
                                    creep.say('T: '+r);
                                }else{
                                    creep.say('Amount: '+creep.store[r]);
                                }
                                creep.moveTo(storage);
                            }
                        }
                    }
                }
                // pushTask(creep.room.name,'storage','terminal','energy',30000);
                for(let r of creep.storeList){
                    creep.drop(r);
                }
                
                return;
            }
            
            creep.say('T:'+creep.store.energy);
            
            if(Memory.rooms[creep.room.name].invade){
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.energy < 900;
                    }
                });
                if(target) {
                    creep.memory.done=false;
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        //creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_LAB &&
                            structure.energy < structure.energyCapacity
                            && Game.flags[creep.room.name+'_boost']
                            && _.keys(Game.flags[creep.room.name+'_boost'].memory.labs).indexOf(structure.id)!=-1;
                    }
                });
                if(target) {
                    creep.memory.done=false;
                    if(creep.pos.inRangeTo(target,1)){
                        var target2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.id!=target.id && structure.structureType == STRUCTURE_LAB &&
                                    structure.energy < structure.energyCapacity;
                            }
                        });
                        creep.transfer(target, RESOURCE_ENERGY)
                        if(target2 && creep.store.energy>(target.energyCapacity-target.energy+target2.energyCapacity-target2.energy)){
                            creep.moveTo(target2);
                        }
                    }else{
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
            }
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_SPAWN &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(target) {
                creep.memory.done=false;
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //creep.say('Transfer...');
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                if(creep.room.energyAvailable<creep.room.energyCapacityAvailable*0.5){
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_EXTENSION &&
                                structure.energy < structure.energyCapacity;
                        }
                    });
                    if(target) {
                        creep.memory.done=false;
                        if(creep.pos.inRangeTo(target,1)){
                            var target2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.id!=target.id && structure.structureType == STRUCTURE_EXTENSION &&
                                        structure.energy < structure.energyCapacity;
                                }
                            });
                            creep.transfer(target, RESOURCE_ENERGY)
                            if(target2 && creep.store.energy>(target.energyCapacity-target.energy+target2.energyCapacity-target2.energy)){
                                creep.moveTo(target2);
                            }
                        }else{
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        return;
                    }
                }
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.energy < 700;
                    }
                });
                if(target) {
                    creep.memory.done=false;
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        //creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_LAB &&
                                structure.energy < structure.energyCapacity
                                && Game.flags[creep.room.name+'_boost']
                                && _.keys(Game.flags[creep.room.name+'_boost'].memory.labs).indexOf(structure.id)!=-1;
                        }
                    });
                    if(target) {
                        creep.memory.done=false;
                        if(creep.pos.inRangeTo(target,1)){
                            var target2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.id!=target.id && structure.structureType == STRUCTURE_LAB &&
                                        structure.energy < structure.energyCapacity;
                                }
                            });
                            creep.transfer(target, RESOURCE_ENERGY)
                            if(target2 && creep.store.energy>(target.energyCapacity-target.energy+target2.energyCapacity-target2.energy)){
                                creep.moveTo(target2);
                            }
                        }else{
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        return;
                    }
                    else{
                        var ext = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_EXTENSION &&
                                    structure.energy < structure.energyCapacity;
                            }
                        });
                        if(ext) {
                            creep.memory.done=false;
                            if(creep.pos.inRangeTo(ext,1)){
                                var ext2 = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return structure.id!=ext.id && structure.structureType == STRUCTURE_EXTENSION &&
                                            structure.energy < structure.energyCapacity;
                                    }
                                });
                                creep.transfer(ext, RESOURCE_ENERGY)
                                if(ext2 && creep.store.energy-(ext.energyCapacity-ext.energy)){
                                    creep.moveTo(ext2);
                                    return;
                                }
                            }else{
                                creep.moveTo(ext, {visualizePathStyle: {stroke: '#ffffff'}});
                                return;
                            }
                        }
                        
                        const target = creep.room.storage;
                        if(target){
                            if(target.store.energy<800000){
                                RESOURCES_ALL.forEach(resourceType => {
                                    if(creep.store[resourceType]){
                                        let status=creep.transfer(target, resourceType);
                                        if(status == ERR_NOT_IN_RANGE) {
                                            //creep.say('Transfer...');
                                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                        }else{
                                            creep.memory.done=true;
                                        }
                                    }
                                });
                            }
                            else{
                                const target=creep.room.terminal;
                                if(target && target.store.getFreeCapacity()){
                                    creep.memory.done=true;
                                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        //creep.say('Transfer...');
                                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                    }
                                }else{
                                    const target=creep.room.factory;
                                    if(target){
                                        if(target.store.getFreeCapacity()){
                                            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                                //creep.say('T:'+creep.store.energy);
                                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = Transporter;