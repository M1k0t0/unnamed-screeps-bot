var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var storeAll=0;
        RESOURCES_ALL.forEach(resourceType => storeAll+=creep.store[resourceType]);
        creep.say(storeAll);
        if(storeAll==0){
            creep.memory.Transfer=false;
        }
        else if(storeAll==creep.store.getCapacity()){
            creep.memory.Transfer=true;
            creep.say('full');
        }
        if(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)){
            const spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.type==STRUCTURE_SPAWN;
                }
            });
            creep.moveTo(spawn);
        }
	    if(!creep.memory.Transfer && creep.ticksToLive>50) {
            //var target = creep.room.find(FIND_DROPPED_ENERGY);
            const target = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (resource) => {
                    return resource.resourceType == RESOURCE_ZYNTHIUM;
                }
            });
            if(target.length) {
                creep.say('pickup()');
                if(creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
            }
            else{
                const target = creep.room.find(FIND_MINERALS, {
                    filter: (structure) => {
                        return structure.mineralAmount>0;
                    }
                });
                if(target.length) {
                    if(creep.harvest(target[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target[0]);
                    }
                }
                else{
                    const spawn = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.type==STRUCTURE_SPAWN;
                        }
                    });
                    creep.moveTo(spawn[0]);
                }
            }
        }
        else {
            if(creep.room.name=='W25S11'){
                const target = creep.room.storage;
                if(target) {
                    if(creep.transfer(target, RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
                        creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
            }else if(creep.room.name=='W29S11'){
                const target = creep.room.terminal;
                if(target) {
                    if(creep.transfer(target, RESOURCE_KEANIUM) == ERR_NOT_IN_RANGE) {
                        creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
            }else if(creep.room.name=='W27S14'){
                const target = creep.room.storage;
                if(target) {
                    if(creep.transfer(target, RESOURCE_OXYGEN) == ERR_NOT_IN_RANGE) {
                        creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
            }else if(creep.room.name=='W36S11'){
                const target = creep.room.terminal;
                if(target) {
                    if(creep.transfer(target, RESOURCE_CATALYST) == ERR_NOT_IN_RANGE) {
                        creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
            }else if(creep.room.name=='W27S9'){
                const target = creep.room.storage;
                if(target) {
                    if(creep.transfer(target, RESOURCE_OXYGEN) == ERR_NOT_IN_RANGE) {
                        creep.say('Transfer...');
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
            }
            if(creep.ticksToLive<100){
	            creep.memory.recycle=true;
	        }

                /*
                else{
                    if(creep.carry.energy<creep.energyCapacity/3){
                        creep.memory.Transfer!='False';
                    }
                }
                */
        }
	}
};

module.exports = roleMiner;