/*
 * 硬起来了
 * 别骂了别骂了 为了收个邻居随手摸的代码（逃
 */

module.exports = {
    run: function(creep){
        let rn=null;
        
        if(creep.room.name!=rn) creep.moveTo(new RoomPosition(25,25,rn));
        
        let hs=creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(!hs) hs=creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        if(hs){
            creep.say('attack');
            creep.attack(hs);
            creep.moveTo(hs);
        }
    }
};