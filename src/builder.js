var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //return 0;
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }

	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
        }

	    if(creep.memory.building) {
	        var target;
            if(creep.memory.target){
                target = Game.getObjectById(creep.memory.target);
            }
            if(!target){
                if(!creep.memory.no_target){
                    Memory.rooms[creep.room.name].updatePrototype=true;
                    creep.memory.target=null;
                }
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }
            if(target) {
                creep.memory.target=target.id;
                if(creep.memory.no_target){
                    //Memory.rooms[creep.room.name].build=true;
                    creep.memory.no_target=false;
                }
                if(!creep.pos.inRangeTo(target,1)) {
                    creep.memory.no_pull=true;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }else{
                    creep.memory.no_pull=false;
                }
                creep.build(target);
            }else{
                //Memory.rooms[creep.room.name].build=false;
                creep.memory.no_target=true;
                
                //return 0;
                creep.say('repairing')
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART) &&
                            structure.hits < 10000000;
                    }
                });
                if(target) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else{
                        //creep.moveTo(Game.flags['Repair']);
                        creep.say('⚠️ '+creep.carry.energy+'/'+creep.carryCapacity);
                    }
                }else{
                    if(creep.room.controller && creep.room.controller.level>4 && creep.room.controller.my){
                        if(Game.spawns[creep.room.name+'_Spawn0']){
                            if(Game.spawns[creep.room.name+'_Spawn0'].recycleCreep(creep)==ERR_NOT_IN_RANGE){
                                creep.moveTo(Game.spawns[creep.room.name+'_Spawn0']);
                            }
                        }
                    }
                }
            }
	    }
	    else {
	        if(!Memory.rooms[creep.room.name].invade){
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
                    filter:(r)=>{
                        if(r.resourceType!='energy'){
                            return false;
                        }
                        if(creep.room.controller && creep.room.controller.level<3){
                            return creep.pos.inRangeTo(r,20) && r.amount>creep.store.getFreeCapacity(r.resourceType);
                        }
                        return creep.pos.inRangeTo(r,16) || r.amount>creep.store.getFreeCapacity(r.resourceType)*3;
                    }
                });
                if(target) {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
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
                    if(!link.pos.inRangeTo(creep.room.center,6)) continue;   // max range 17
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
                    if(link && link.store.energy && link.store.energy<link.store.getCapacity('energy') && link.cooldown==0){
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
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy>creep.store.getFreeCapacity('energy');
                }
            });
            if(target) {
                if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    const dtarget = creep.pos.findInRange(FIND_DROPPED_RESOURCES,2);
                    if(dtarget.length) {
                        if(creep.pickup(dtarget[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(dtarget[0]);
                            return;
                        }
                    }
                    creep.moveTo(target);
                }
            }
            else{
                const target=creep.room.storage;
                if(target&&target.store.energy){
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
};

module.exports = roleBuilder;