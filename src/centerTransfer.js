/**********************************************

author：Mikoto Kagurazaka
version:1.0

从大号搬过来的centerTransfer代码 居然能直接用 我太强了（bushi
勉强能冲，后面肯定要重构，希望能做出那种有回调的任务系统。
现在大号模块之间太独立了，状态机都难。

***************************************************/

function flagRun(flag){
    const creep = Game.creeps[flag.pos.roomName+'_centerTransfer'];
    if(flag.memory.remove || !flag.room){
        return;
    }
    if(!creep){
        var spawn = getAvaliableSpawn(flag);
        if(spawn){
            //这里的body如不满意可以自行调整
            var body = [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            if(flag.room.controller.level==8){
                body = [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            }

            spawn.spawnCreep(body,flag.pos.roomName+'_centerTransfer',{memory:{dontheal:true}})
        }
    }else{
        centerCreep(creep,flag);
    }

}

module.exports = {
    init : function(){
        Memory.DepositKeeper={'ControlRooms':[]}
        for(var name in Game.rooms){
            if(Game.rooms[name].controller && Game.rooms[name].controller.my && Game.rooms[name].terminal){
                Memory.DepositKeeper['ControlRooms'].push(name);
            }          
        }
    },
    run : function(){
        //return;
        for(var flagName in Game.flags){
            var flag = Game.flags[flagName];
            if(flagName.indexOf('_center')!=-1){
                flagRun(flag);
            }
        }
    }
};
//找到可以该房间内空闲的spawn
function getAvaliableSpawn(flag){
    return flag.pos.findClosestByPath(FIND_STRUCTURES,{
        filter:(structure) => {
            return structure.structureType=='spawn' && structure.spawning==undefined;
        }
    })
}

//这部分主要负责控制creep
function centerCreep (creep,flag){
    //现在确保移动到了旗子位置
    //读取flag里面存的资源，不合法再找
    
    const tasks=Memory.tasks[creep.pos.roomName];
    if(tasks==undefined){
        Memory.tasks[creep.pos.roomName]=[[],{}];
    }else if(tasks[0].length){
        let task=tasks[1][tasks[0][0]];
        if(!task){
            creep.say(tasks[0][0]);
            return;
        }
        let id=task.id;
        let from=task.from;
        let to=task.to;
        let resourceType=task.resourceType;
        let amount=task.amount;
    
        if(task){
            creep.say('working');
            
            creep.memory.no_pull=true;
            
            const w_Object=Game.getObjectById(from);
            const t_Object=Game.getObjectById(to);
            if(tasks[1][tasks[0][0]].amount<=0){
                tasks[0].splice(tasks[0].indexOf(id),1);
                delete tasks[1][id];
                let task=tasks[1][tasks[0][0]];
                if(!tasks[0].length){
                    creep.moveTo(flag);
                    return;
                }
            }
            if(!(creep.store.getUsedCapacity())){
                if(w_Object.store[resourceType]==0){
                    tasks[0].splice(tasks[0].indexOf(id),1);
                    delete tasks[1][id];
                    return;
                }
                if(creep.ticksToLive>5){
                    if(amount<creep.store.getFreeCapacity()){
                        var status=creep.withdraw(w_Object,resourceType,amount);
                    }else{
                        var status=creep.withdraw(w_Object,resourceType);
                    }
                    if(status==ERR_NOT_IN_RANGE){
                        creep.moveTo(w_Object);
                    }else{
                        if(status!=OK){
                            creep.say('W_E:'+status);
                            if(status==-6){
                                task.amount=w_Object.store[resourceType];
                                creep.withdraw(w_Object,resourceType,w_Object.store[resourceType]);
                            }
                        }else{
                            creep.moveTo(t_Object);
                            creep.say(id);
                        }
                    }
                }
            }else{
                if(creep.store.getUsedCapacity(resourceType)<creep.store.getUsedCapacity()){
                    if(creep.room.storage && creep.room.storage.store.getFreeCapacity()){
                        if(creep.transfer(creep.room.storage,_.keys(creep.store)[0])==ERR_NOT_IN_RANGE){
                            creep.moveTo(creep.room.storage);
                        }
                    }else if(creep.room.terminal && creep.room.terminal.store.getFreeCapacity()){
                        if(creep.transfer(creep.room.terminal,_.keys(creep.store)[0])==ERR_NOT_IN_RANGE){
                            creep.moveTo(creep.room.terminal);
                        }
                    }
                    return;
                }
                let status=creep.transfer(t_Object,resourceType);
                const amount=creep.store.getUsedCapacity(resourceType);
                if(!task.ns && t_Object.store.getFreeCapacity(resourceType)==0){
                    tasks[0].splice(tasks[0].indexOf(id),1);
                    delete tasks[1][id];
                    return;
                }
                if(status==ERR_NOT_IN_RANGE){
                    creep.moveTo(t_Object);
                }else if(status==OK){
                    creep.moveTo(w_Object);
                    creep.say(id);
                    
                    tasks[1][tasks[0][0]].amount-=amount;
                    // if(tasks[1][tasks[0][0]].amount<=0){
                    //     tasks[0].splice(tasks[0].indexOf(id),1);
                    //     delete tasks[1][id];
                    // }
                }else{
                    if(task.ns && (t_Object.resourceType==STRUCTURE_TERMINAL || t_Object.resourceType==STRUCTURE_FACTORY) && t_Object.cooldown){
                        return;
                    }
                    if(status==ERR_FULL){
                        tasks[0].splice(tasks[0].indexOf(id),1);
                        delete tasks[1][id];
                    }
                }
            }
        }
    }else{
        creep.say('idle');
        
        creep.memory.no_pull=false;
        
        if(creep.store.getUsedCapacity()){
            if(creep.room.storage && creep.room.storage.store.getFreeCapacity()){
                if(creep.transfer(creep.room.storage,_.keys(creep.store)[0])==ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.storage);
                }
            }else if(creep.room.terminal && creep.room.terminal.store.getFreeCapacity()){
                if(creep.transfer(creep.room.terminal,_.keys(creep.store)[0])==ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.terminal);
                }
            }
        }
        
        //console.log(JSON.stringify(flag));
        if(!creep.pos.isEqualTo(flag.pos)){
            creep.moveTo(flag);
        }
    }
    
}