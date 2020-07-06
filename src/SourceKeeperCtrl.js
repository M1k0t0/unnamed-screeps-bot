/**********************************************

author：ChenyangDu, Tracer
version:2.1

矿机自动化：
功能：新老矿机自动交替，矿机位置自动建造container，矿机自动寻找周围一格内的link并填充

使用方法：
1、在energy临近一格的位置插上旗，旗的两个颜色要都是黄色。
2、该房间内有自己的spawn，该代码不适用于外矿
2、（非必须）在旗子附近一格内建造link，矿机会自动填充link，以及从container里面取能量填充到link。

代码部分如下

var SourceKeeperCtrl = require('SourceKeeperCtrl')

module.exports.loop = function () {
    SourceKeeperCtrl.run();

    //your code

}

***************************************************/


//该部分代码主要实现新老creep交替，用命名来区分，后缀分别为0或1

const needContainer = true;
const needToSaveCpu = true;//可以生产10WORK的creep快速挖矿，然后休息，用能量换CPU的方法
const usdCreepMove_Yuan = true;//如果你使用了Yuandiaodiaodiao所写的对穿，那么可以把这个设置为true，要不然新老creep交替会鬼畜

function flagRun(flag){
    const creep0 = Game.creeps[flag.name + '_0']
    const creep1 = Game.creeps[flag.name + '_1']
    const dyingTick = 100;//其中一个寿命不足50就生产另一个，常数可以调整，也可以不用常数
    var needToSpawnName = null;
    if(!creep0 && !creep1){
        needToSpawnName = flag.name + '_1'
    }
    if(creep0){
        SourceKeeper(creep0,flag)
        if(!creep1 & creep0.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_1';
        }
    }
    if(creep1){
        SourceKeeper(creep1,flag)
        if(!creep0 & creep1.ticksToLive <= dyingTick){
            needToSpawnName = flag.name + '_0';
        }
    }
    if(needToSpawnName){
        var spawn = getAvaliableSpawn(flag.room.name)
        if(spawn){
            //这里的body如不满意可以自行调整
            var body = [MOVE,WORK,WORK]
            if(spawn.room.energyAvailable >= 550){
                body = [WORK,WORK,WORK,WORK,WORK,MOVE]
            }
            if(spawn.room.energyAvailable >= 700){
                body = [MOVE,MOVE,MOVE,CARRY,WORK,WORK,WORK,WORK,WORK]
            }
            if(needToSaveCpu && spawn.room.energyAvailable >= 1200){
                body = [MOVE,MOVE,MOVE,CARRY,WORK,WORK,WORK,WORK,WORK,
                    MOVE,MOVE,WORK,WORK,WORK,WORK,WORK]
            }
            //body = [MOVE,WORK,WORK]
            spawn.spawnCreep(body,needToSpawnName,{memory:{dontheal:true,no_pull:true}});
        }
    }
}

module.exports = {
    run:function(flag){
        if(!flag.room){
            return;
        }
        flagRun(flag);
        if(!flag.memory.found){
            //console.log(flag.pos.y-1,flag.pos.x-1,flag.pos.y+1,flag.pos.x+1)
            let obj_list=flag.room.lookForAtArea(LOOK_TERRAIN,flag.pos.y-1,flag.pos.x-1,flag.pos.y+1,flag.pos.x+1,true);
            for(let obj of obj_list){
                if(obj['terrain']=='wall'){
                    continue;
                }
                let next=false;
                for(let rp of Memory.rooms[flag.pos.roomName].autoplace.mine){
                    if((rp.x==obj.x && rp.y==obj.y) || (obj.x==flag.pos.x && obj.y==flag.pos.y)){
                        //console.log((rp.x==flag.pos.x && rp.y==flag.pos.y));
                        next=true;
                        break;
                    }
                }
                if(next){
                    continue;
                }
                flag.memory.linkpos=new RoomPosition(obj.x,obj.y,flag.pos.roomName);
                flag.memory.found=true;
                break;
            }
        }
        if(flag.memory.link){
            let link=Game.getObjectById(flag.memory.link);
            if(link){
                if(Memory.rooms[flag.pos.roomName].links.out.indexOf(flag.memory.link)==-1){
                    Memory.rooms[flag.pos.roomName].links.out.push(flag.memory.link);
                }
            }else{
                Memory.rooms[flag.pos.roomName].links.out.splice(Memory.room[flag.pos.roomName].links.out.indexOf(flag.memory.link),1);
            }
        }
        if(flag.memory.linkpos&&!flag.memory.link){
            flag.room.visual.structure(flag.memory.linkpos.x,flag.memory.linkpos.y,'link');
            if(flag.room.controller.level<=5){
                if(flag.name.indexOf('_0')!=-1 && Game.flags[flag.pos.roomName+'_source_1']){
                    return;
                }else{
                    flag.room.createConstructionSite(flag.memory.linkpos.x,flag.memory.linkpos.y,'link');
                    return;
                }
                if(flag.name.indexOf('_1')!=-1){
                    let distance_0=Memory.flags[flag.pos.roomName+'_source_0'].linkpos.getRangeTo(Memory.rooms[flag.pos.roomName]);
                    let distance_1=flag.memory.linkpos.getRangeTo(Memory.rooms[flag.pos.roomName]);
                    if(distance_0<distance_1){
                        flag.room.createConstructionSite(flag.memory.linkpos.x,flag.memory.linkpos.y,'link');
                        return;
                    }else{
                        flag.room.visual.structure(Memory.flags[flag.pos.roomName+'_source_0'].linkpos.x,Memory.flags[flag.pos.roomName+'_source_0'].linkpos.y,'link');
                    }
                }
            }else{
                flag.room.createConstructionSite(flag.memory.linkpos.x,flag.memory.linkpos.y,'link');
            }
        }
        /*
        for(var flagName in Game.flags){
            var flag = Game.flags[flagName]
            if(flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_YELLOW){
                flagRun(flag)
            }
        }
        */
    }
};
//找到可以该房间内空闲的spawn
function getAvaliableSpawn(roomName){
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
    //container不存在就建一个
    var container = Game.getObjectById(flag.memory.container);
    if(needContainer){
        if(!container){
            container = flag.pos.lookFor(LOOK_STRUCTURES).find(o =>(o.structureType == STRUCTURE_CONTAINER))
            if(!container){
                if(flag.room.controller.level>=3){
                    flag.pos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }else{
                flag.memory.container = container.id;
            }
        }else {
        creep.say(container.store[RESOURCE_ENERGY])
        }
    }
    //移动到旗子
    if(!creep.pos.isEqualTo(flag.pos)){
        if(usdCreepMove_Yuan){
            creep.moveTo(flag,{ignoreCreeps:false})
        }else{
            creep.moveTo(flag);
        }
        return;
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
    }

    //有link，就往link里面填，没有就隔100ticks找一下
    var link = Game.getObjectById(flag.memory.link);
    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
        if(link && link.store.getFreeCapacity(RESOURCE_ENERGY)){
            creep.transfer(link,RESOURCE_ENERGY);
        }else if(container){
            creep.transfer(container,RESOURCE_ENERGY);
        }
    }
    if(Game.time % 100 == 0){
        var links = flag.pos.findInRange(FIND_STRUCTURES,1,
            {filter:o=>(o.structureType == STRUCTURE_LINK)});
        if(links.length){
            flag.memory.link = links[0].id;
        }
    }
    if(link && container){
        if(link.store[RESOURCE_ENERGY] < link.store.getCapacity(RESOURCE_ENERGY) &&
        container.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                creep.withdraw(container,RESOURCE_ENERGY)
            }
        }
    }
}