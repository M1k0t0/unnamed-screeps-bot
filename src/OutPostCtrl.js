/**********************************************

author：Tracer
version:1.0

将旗插到外矿采矿位上，可以自动根据距离判断主房。

旗帜命名要求：
如果希望自动寻找，请命名为 "outpost_"+不重复id
如果想要手动指定，请命名为 房号+"_outpost_"+不重复id

***************************************************/

const needToSaveCpu = false;
const usdCreepMove_Yuan = true;
const needContainer = true;

function flagRun(flag){
    
    let home=flag.memory.home;
    if(!home){
        if(flag.name.indexOf('outpost_')==0){
            home=getClosestRoom(flag.pos.roomName);
            flag.memory.home=home;
        }else{
            flag.memory.home=flag.name.substring(0,flag.name.indexOf('_outpost_'));
        }
    }
    if(!flag.memory.invade){
        flag.memory.invade=1;
    }
    if(!flag.memory.wait){
        flag.memory.wait=1500;
    }
    if(!flag.memory.pathtime){
        flag.memory.pathtime=-1;
    }
    const miner0 = Game.creeps[flag.name + '_worker_0'];
    const miner1 = Game.creeps[flag.name + '_worker_1'];
    let dyingTick = flag.memory.pathtime;
    var needToSpawnName = null;
    if(!miner0 && !miner1){
        needToSpawnName = flag.name + '_worker_1';
    }
    if(miner0){
        SourceKeeper(miner0,flag)
        if(!miner1 & miner0.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_worker_1';
        }
    }
    if(miner1){
        SourceKeeper(miner1,flag,dyingTick);
        //console.log(miner1.ticksToLive,dyingTick)
        if(!miner0 & miner1.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_worker_0';
        }
    }
    //console.log(needToSpawnName)
    if(flag.memory.invade){
        if(flag.memory.invade+flag.memory.wait-flag.memory.pathtime>Game.time){
            console.log('stop',flag.name)
            needToSpawnName=null;
        }
    }
    if(needToSpawnName){
        var spawn = getAvaliableSpawn(home);
        let body=[];
        if(spawn){
            //这里的body如不满意可以自行调整
            if(spawn.room.energyAvailable >= 550){
                body = [MOVE,WORK,WORK,WORK,WORK,CARRY,MOVE]
            }
            if(spawn.room.energyAvailable >= 900){
                body = [MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE]
            }
            if(needToSaveCpu && spawn.room.energyAvailable >= 1200){
                body = [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,
                    MOVE,MOVE,WORK,WORK,WORK,WORK,WORK]
            }
            if(body.length){
                if(spawn.spawnCreep(body,needToSpawnName,{memory:{no_pull:true}})==OK){
                    return;
                }
            }
        }
    }
    const porter0 = Game.creeps[flag.name + '_porter_0'];
    const porter1 = Game.creeps[flag.name + '_porter_1'];
    dyingTick = flag.memory.pathtime;//其中一个寿命不足50就生产另一个，常数可以调整，也可以不用常数
    var needToSpawnName = null;
    if(!porter0 && !porter1){
        needToSpawnName = flag.name + '_porter_1';
    }
    if(porter0){
        //console.log(porter0.name)
        Transporter(porter0,flag)
        if(!porter1 & porter0.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_porter_1';
        }
    }
    if(porter1){
        Transporter(porter1,flag)
        // console.log(porter1.ticksToLive,dyingTick)
        if(!porter0 & porter1.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_porter_0';
        }
    }
    if(flag.memory.invade){
        //console.log(flag.memory.invade+'+'+flag.memory.wait+'-'+flag.memory.pathtime+'>'+Game.time)
        if(flag.memory.invade+flag.memory.wait-flag.memory.pathtime>Game.time){
            console.log('stop',flag.name)
            needToSpawnName=null;
        }
    }
    if(needToSpawnName){
        var spawn = getAvaliableSpawn(home);
        let body=[];
        if(spawn){
            //这里的body如不满意可以自行调整
            if(spawn.room.energyAvailable >= 500 && spawn.room.controller.level<=3){
                body = [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,WORK];
            }
            if(spawn.room.energyAvailable >= 800){
                body = [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK];
            }
            if(spawn.room.energyAvailable >= 1150){
                body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            }
            if(spawn.room.energyAvailable >= 1600){
                body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            }
            if(spawn.room.energyAvailable >= 2200){
                body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            }
            //if(spawn.room.energyAvailable >= 2500){
                //body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            //}
            if(body.length){
                spawn.spawnCreep(body,needToSpawnName);
            }
        }
    }
    if(flag.memory.invadercore){
        if(!Game.creeps[flag.name+'_guard']){
            var spawn = getAvaliableSpawn(home);
            let body=[];
            if(spawn){
                //这里的body如不满意可以自行调整
                if(spawn.room.energyAvailable >= 520 && spawn.room.controller.level<=3){
                    body = [MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK];
                }
                if(spawn.room.energyAvailable >= 780){
                    body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
                }
                if(spawn.room.energyAvailable >= 1260){
                    body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
                }
                if(spawn.room.energyAvailable >= 1680){
                    body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
                }
                if(spawn.room.energyAvailable >= 2100){
                    body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
                }
                if(body.length){
                    spawn.spawnCreep(body,flag.name+'_guard',{memory:{no_pull:true}});
                }
            }
        }else{
            coreRemover(Game.creeps[flag.name+'_guard'],flag);
        }
    }
    if(Memory.rooms[flag.pos.roomName] && !Memory.rooms[flag.pos.roomName].reserve){
        if(flag.memory.invade){
            //console.log(flag.memory.invade+'+'+flag.memory.wait+'-'+flag.memory.pathtime+'>'+Game.time)
            if(flag.memory.invade+flag.memory.wait-flag.memory.pathtime<=Game.time){
                if(!Game.creeps[flag.pos.roomName+'_reserver']){
                    var spawn = getAvaliableSpawn(home);
                    let body=[];
                    if(spawn){
                        //这里的body如不满意可以自行调整
                        if(spawn.room.controller.level<=3){
                            body = [];
                        }
                        if(spawn.room.energyAvailable >= 1300){
                            body = [MOVE,MOVE,CLAIM,CLAIM];
                        }
                        // if(spawn.room.energyAvailable >= 1950){
                        //     body = [MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM];
                        // }
                        // if(spawn.room.energyAvailable >= 2600){
                        //     body = [MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM,CLAIM];
                        // }
                        // if(spawn.room.energyAvailable >= 3250){
                        //     body = [MOVE,MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM];
                        // }
                        if(body.length){
                            spawn.spawnCreep(body,flag.pos.roomName+'_reserver');
                        }
                    }
                }else{
                    Reserver(Game.creeps[flag.pos.roomName+'_reserver'],flag);
                }
            }
        }
        
    }
}

module.exports = {
    run:function(flag){
        flagRun(flag);
    }
};
//找到可以该房间内空闲的spawn
function getAvaliableSpawn(roomName){
    if((Game.rooms[roomName] && Game.rooms[roomName].energyAvailable<Game.rooms[roomName].energyCapacityAvailable*0.5 )){
        return null;
    }
    for (var spawnName in Game.spawns){
        var spawn = Game.spawns[spawnName]
        if(spawn.room.name == roomName && spawn.spawning == null){
            return spawn
        }
    }
    return null;
}

//这部分主要负责控制creep
function SourceKeeper (creep,flag){
    if(flag.memory.autoplace[creep.room.name] && flag.memory.autoplace[creep.room.name].length){
        for(let p of flag.memory.autoplace[creep.room.name]){
            creep.room.createConstructionSite(p[0],p[1],'road');
        }
        flag.memory.autoplace[creep.room.name]=[];
    }
    //移动到旗子
    if(!creep.pos.isEqualTo(flag.pos)){
        creep.say(flag.name);
        if(creep.pos.isNearTo(flag.pos)){
            if(!creep.memory.inpos){
                creep.memory.inpos=true;
                flag.memory.pathtime=1500-creep.ticksToLive;
            }
        }
        if(usdCreepMove_Yuan){
            creep.moveTo(flag,{ignoreCreeps:false})
        }else{
            creep.moveTo(flag);
        }
        return;
    }
    if((creep.room.find(FIND_HOSTILE_CREEPS).length && (creep.room.find(FIND_HOSTILE_CREEPS)[0].getActiveBodyparts('attack') || creep.room.find(FIND_HOSTILE_CREEPS)[0].getActiveBodyparts('ranged_attack'))) || creep.room.find(FIND_HOSTILE_STRUCTURES).length){
        if(!flag.memory.invade || flag.memory.invade+flag.memory.wait<Game.time){
            flag.memory.invade=Game.time;
            if(Game.time-flag.memory.invade>flag.memory.wait*2.2){
                flag.memory.wait+=1000;
            }
        }
        if(flag.memory.wait>1500 && Game.time-flag.memory.invade<flag.memory.wait*1.2){
            flag.memory.wait-=(flag.memory.wait-1000)/2;
            if(flag.memory.wait<1500-flag.memory.pathtime){
                flag.memory.wait=1500-flag.memory.pathtime;
            }
        }
    }
    if(creep.room.find(FIND_HOSTILE_STRUCTURES).length){
        flag.memory.invadercore=creep.room.find(FIND_HOSTILE_STRUCTURES)[0].id;
    }
    if(Memory.rooms[creep.room.name]){
        if(Memory.rooms[creep.room.name].reserve==undefined){
            Memory.rooms[creep.room.name].reserve=false;
        }else{
            if(!creep.room.controller.reservation || creep.room.controller.reservation.username!=Game.rooms[flag.memory.home].controller.owner.username || creep.room.controller.reservation.ticksToEnd<3700+flag.memory.pathtime){
                Memory.rooms[creep.room.name].reserve=false;
            }else{
                Memory.rooms[creep.room.name].reserve=true;
            }
        }
    }

    //container不存在就建一个
    var container = Game.getObjectById(flag.memory.container);
    if(needContainer){
        if(!container){
            container = flag.pos.lookFor(LOOK_STRUCTURES).find(o =>(o.structureType == STRUCTURE_CONTAINER))
            if(!container){
                flag.pos.createConstructionSite(STRUCTURE_CONTAINER)
            }else{
                flag.memory.container = container.id;
            }
        }else {
        creep.say(container.store[RESOURCE_ENERGY])
        }
    }
    
    //现在确保移动到了旗子位置
    //读取flag里面存的资源，不合法再找
    
    var source = Game.getObjectById(flag.memory.source);
    if(!source){
        source = flag.pos.findInRange(FIND_SOURCES,1)[0]
        flag.memory.source = source.id;
        var source = Game.getObjectById(flag.memory.source);
    }
    if(source.energy > 0){
        if(creep.harvest(source) != OK){
            creep.say(creep.harvest(source))
        }
    }
    if(!container){
        const target = creep.pos.lookFor(LOOK_RESOURCES);
        if(target[0]) {
            creep.pickup(target[0]) 
        }
        if(creep.room.name==flag.pos.roomName){
            if(creep.store.energy>20){
                let target;
                if(creep.memory.target){
                    target = Game.getObjectById(creep.memory.target);
                }
                if(!target){
                    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{
                        filter:(s) => {
                            return s.structureType==STRUCTURE_CONTAINER && s.pos.isEqualTo(creep) && s.my;
                        }
                    });
                }
                if(target) {
                    creep.memory.target=target.id;
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }else{
        if(container.hits<container.hitsMax){
            creep.repair(container);
        }else{
            creep.transfer(container,RESOURCE_ENERGY);
        }
    }
    
}
function Transporter (creep,flag){
    if(creep.isEmpty){
        creep.memory.Transfer=false;
    }
    else if(creep.isFull || creep.ticksToLive<flag.memory.pathtime){
        creep.memory.Transfer=true;
    }
    if(flag.memory.invade+flag.memory.wait>Game.time || creep.room.find(FIND_HOSTILE_CREEPS).length && (creep.room.controller && !creep.room.controller.my)){
        creep.memory.suicide=true;
        creep.memory.Transfer=true;
    }
    let r=creep.pos.lookFor(LOOK_RESOURCES);
    if(r.length && r.resourceType=='energy'){
        creep.pickup(r[0]);
    }
    let t=creep.pos.lookFor(LOOK_TOMBSTONES);
    if(t.length && t[0].store.energy){
        creep.withdraw(t[0],RESOURCE_ENERGY);
    }
    if(!creep.memory.Transfer){
        if(!Game.creeps[flag.name+'_worker_0'] && !Game.creeps[flag.name+'_worker_1']){
            SourceKeeper(creep,flag);
            return;
        }else if((Game.creeps[flag.name+'_worker_0'] && Game.creeps[flag.name+'_worker_0'].pos.roomName!=flag.pos.roomName)||(Game.creeps[flag.name+'_worker_1'] && Game.creeps[flag.name+'_worker_1'].pos.roomName!=flag.pos.roomName)){
            SourceKeeper(creep,flag);
            return;
        }
        let source=Game.getObjectById(flag.memory.source);
        if(source){
            if(source.energy==0 && source.ticksToRegeneration>flag.memory.pathtime && creep.store.energy>creep.store.getCapacity('energy')*0.3){
                creep.memory.Transfer=true;
                return;
            }
        }
        if(!creep.pos.isNearTo(flag)){
            creep.say('running');
            if(usdCreepMove_Yuan){
                creep.moveTo(flag,{ignoreCreeps:false})
            }else{
                creep.moveTo(flag);
            }
            return;
        }
        creep.say('e:'+creep.store.energy);
        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy>creep.store.getFreeCapacity()*0.2 && structure.pos.inRangeTo(creep,1);
            }
        });
        if(target) {
            if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }else{
                const dtarget = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1);
                if(dtarget.length) {
                    //console.log(1)
                    creep.memory.no_pull=true;
                    creep.pickup(dtarget[0]);
                }
            }
        }
    }
    if(creep.memory.suicide){
        if(creep.isEmpty){
            creep.suicide();
            return;
        }
    }
    if(creep.memory.Transfer){
        if(creep.room.name==flag.pos.roomName && creep.ticksToLive>flag.memory.pathtime){
            //creep.room.createConstructionSite(creep.pos.x,creep.pos.y,'road');
            var target;
            if(creep.memory.build){
                target = Game.getObjectById(creep.memory.build);
            }
            if(!target){
                creep.memory.build=null;
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{
                    filter:(s) => {
                        return s.my;
                    }
                });
            }
            if(target) {
                creep.memory.build=target.id;
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            
            if(creep.memory.repair){
                target = Game.getObjectById(creep.memory.repair);
            }
            if(!target){
                creep.memory.repair=null;
                creep.say('looking');
                target = creep.pos.lookFor(LOOK_STRUCTURES);
                if(target.length){
                    target=target[0];
                }
            }
            if(target && target.structureType == STRUCTURE_ROAD){
                if(target.hits==target.hitsMax){
                    creep.memory.repair=null;
                }else{
                    creep.say('repairing');
                    if(creep.repair(target)==OK){
                        creep.memory.repair=target.id;
                    }else{
                        creep.memory.repair=null;
                        creep.say('looking');
                    }
                    return;
                }
            }
        }
        if(!flag.memory.backpos && creep.onEdge){
            flag.memory.backpos=[creep.pos.x,creep.pos.y];
        }
        //console.log(1)
        if(Game.rooms[flag.memory.home] && Game.rooms[flag.memory.home].storage){
            let status=creep.transfer(Game.rooms[flag.memory.home].storage,RESOURCE_ENERGY)
            if(status==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.rooms[flag.memory.home].storage);
            }else if(status==OK){
                if(creep.ticksToLive<flag.memory.pathtime*2 || (flag.memory.invade &&flag.memory.invade+flag.memory.wait>Game.time)){
                    creep.suicide();
                }
            }
        }else{
            let core=new RoomPosition(Memory.rooms[flag.memory.home].core[0],Memory.rooms[flag.memory.home].core[1],flag.memory.home);
            if(creep.pos.inRangeTo(core,1)){
                creep.drop(RESOURCE_ENERGY);
                creep.say('drop');
                if(creep.ticksToLive<flag.memory.pathtime*2 || (flag.memory.invade &&flag.memory.invade+flag.memory.wait>Game.time)){
                    creep.suicide();
                }
            }else{
                creep.moveTo(core);
            }
        }
    }
}
function coreRemover(creep,flag){
    if(creep.room.name!=flag.pos.roomName||creep.onEdge){
        creep.moveTo(flag);
    }
    if(flag.memory.invadercore){
        let target=Game.getObjectById(flag.memory.invadercore);
        if(target){
            if(creep.attack(target)==ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }else{
            flag.memory.invadercore=null;
        }
    }else{
        var target;
        if(creep.memory.target){
            target = Game.getObjectById(creep.memory.target);
        }
        if(!target){
            creep.memory.target=null;
            if(Game.time%5==0){
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            }
        }
        if(target) {
            if(creep.attack(target)==ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
    }
}
function Reserver(creep,flag){
    if(creep.room.name!=flag.pos.roomName||creep.onEdge){
        creep.moveTo(flag);
        return;
    }
    if(creep.room.controller) {
        if(creep.reserveController(creep.room.controller)==ERR_NOT_IN_RANGE){
            creep.moveTo(creep.room.controller);
        }
    }
}