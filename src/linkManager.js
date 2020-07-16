/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('linkManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    // init: function(roomName){
    //     if(!link){
    //         return;
    //     }
    //     let room=Game.rooms[roomName];
    //     var mem=Memory.rooms[roomName].links;
    //     for(let i of room.link){
    //         if()
    //     }
    // }
    run: function(roomName){
        let room=Game.rooms[roomName];
        let input=['in','both'];
        let output=['out','both'];
        var mem=Memory.rooms[roomName].links;
        let needStorage=true;
        
        if(room.controller && room.controller.level<5) return;
        
        for(let type of output){
            for(let linkID of mem[type]){
                let link=Game.getObjectById(linkID);
                if(!link){
                    mem[type].splice(mem[type].indexOf(linkID),1);
                    console.log('[LinkManager] '+linkID+'已被破坏,正在丢出列表...');
                    continue;
                }
                if((type=='out' || (!needStorage && type=='both')) && link.store.energy>200){
                    needStorage=false;
                    for(let type2 of input){
                        if(type2==type){
                            continue;
                        }
                        for(let linkID2 of mem[type2]){
                            let link2=Game.getObjectById(linkID2);
                            if(!link2){
                                mem[type2].splice(mem[type2].indexOf(linkID2),1);
                                console.log('[LinkManager] '+linkID2+'已被破坏,正在丢出列表...');
                                continue;
                            }
                            if(800-link2.store.energy<=link.store.energy*1.3&&link2.store.energy<700){
                                link.transferEnergy(link2);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
};