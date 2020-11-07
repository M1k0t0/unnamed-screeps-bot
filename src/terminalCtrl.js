/*
 * 终端控制 v0.1
 * 使用 global.terminalSetting 存储配置
 *
 * 功能:
 *   [x] 自动补充资源（需调用市场模块，中心转运模块）
      *  [x] 多房间计算是否能补充
      *  [x] 自动购买资源
      *  [√] 防止给出后自己资源不足
 *   [√] 持久化资源发送
 */
 
const a2e=[[500,0],[10000,1000],[30000,10000],[100000,50000]];

let terminalCtrl = {
    run: function(roomName){
        // init
        if(!init(roomName)){
            return;
        }
        const room=Game.rooms[roomName];
        const terminal=room.terminal;
        const terminalMem=Memory.rooms[roomName].terminal;
        
        processTask(roomName);
        
        allocationStore(roomName);
    }
};
function allocationStore(roomName){
    if(Game.time % 10 != 5) return;
    if(terminalSetting && Object.keys(terminalSetting).indexOf(roomName)!=-1){
        const room=Game.rooms[roomName];
        const terminal=room.terminal;
        const terminalMem=Memory.rooms[roomName].terminal;
        
        if(!Memory.rooms[roomName].terminal.inProgress){
            Memory.rooms[roomName].terminal.inProgress=[];
        }
        const aList=Memory.rooms[roomName].terminal.inProgress;     // a list that recording the resource when it's being transported.
        
        // check min
        for(let targetResourceType in terminalSetting[roomName]['min']){
            const terminalAmount=terminal.store[targetResourceType];
            const targetMinAmount=terminalSetting[roomName]['min'][targetResourceType]['num']-terminalAmount;
            
            if(targetMinAmount>0){
                if(room.storage){
                    if(room.storage.store[targetResourceType]){
                        newTask(roomName,'storage','terminal',targetResourceType,targetMinAmount);
                        if(aList.indexOf(targetResourceType)==-1){
                            aList.push(targetResourceType);
                        }
                        continue;
                    }else{
                        if(aList.indexOf(targetResourceType)!=-1){
                            aList.splice(aList.indexOf(targetResourceType),1);
                        }
                    }
                }
                
                if(aList.indexOf(targetResourceType)!=-1) continue;
                
                
                for(let way of terminalSetting[roomName]['min'][targetResourceType]['add']){     // get from other rooms or market
                    var check=false;
                    if(way=='store') continue;           // should be market logic [WIP]
                    let targetRoom=Game.rooms[way];
                    if(targetRoom && targetRoom.terminal){
                        let targetRoomName=targetRoom.name;
                        let targetResourceDetail=targetRoom.findM(targetResourceType);
                        if(targetRoom.terminal.store.getFreeCapacity()==0 && (!targetRoom.terminal.store[targetResourceType] || !targetRoom.terminal.store[RESOURCE_ENERGY])){
                            console.log(targetRoomName,'no space.');
                            continue;                    // auto clear terminal [WIP]
                        }
                        if(targetResourceDetail['state']==OK){
                            if(targetResourceDetail['num']>targetMinAmount || (targetMinAmount<=15000 && targetResourceDetail['num'])){
                                var redundancy = 0; 
                                if(terminalSetting[targetRoomName] && terminalSetting[targetRoomName]['min'][targetResourceType]){
                                    for(let limit of a2e){    // check if insufficient for self
                                        if(targetMinAmount<limit[0]){ 
                                            redundancy=limit[1];
                                            break;
                                        }
                                    }
                                }
                                if(targetResourceDetail['num']-targetMinAmount-redundancy>=0){
                                    console.log('['+roomName+'] '+targetRoomName,'has enough '+targetResourceType+' to send.');
                                    let tCost=Game.market.calcTransactionCost(targetMinAmount, roomName, targetRoomName);
                                    let targetRoomEnergyDetail=targetRoom.findM(RESOURCE_ENERGY);
                                    if(targetRoomEnergyDetail['state']==OK){
                                        // bug when send energy [WIP]
                                        if(targetRoomEnergyDetail['num']>=tCost && ((targetRoomEnergyDetail['depots']['storage'] && targetRoomEnergyDetail['depots']['storage']>=tCost) || (targetRoomEnergyDetail['depots']['terminal'] && targetRoomEnergyDetail['terminal']>=tCost))){
                                            check=true;
                                        }else{
                                            console.log(targetRoomName,'has not enough energy to send. require:',tCost);
                                        }
                                    }
                                }else{
                                    console.log(targetRoomName,'has not enough '+targetResourceType+' to send. require:',-(targetResourceDetail['num']-targetMinAmount-redundancy));
                                }
                            }
                        }else{
                            return 'Error task.';
                        }
                    }
                    if(check){
                        console.log(targetRoom.name,'has pushed send task.');
                        send(targetRoom.name,roomName,targetResourceType,targetMinAmount);
                        aList.push(targetResourceType);
                        return;
                    }else{
                        console.log(targetRoom.name+' failed.');
                    }
                }
            }else{
                if(aList.indexOf(targetResourceType)!=-1){
                    aList.splice(aList.indexOf(targetResourceType),1);
                }
            }
        }
        
    }
}
function processTask(roomName){
    const room=Game.rooms[roomName];
    const terminal=room.terminal;
    const terminalMem=Memory.rooms[roomName].terminal;
    const tasks=terminalMem.tasks;
    // start
    if(tasks.length){
        // task = { ... };
        // {
        //     'room':'W36S11',
        //     'resourceType':'tube',
        //     'amount':150
        // }
        const task=tasks[0];
        const targetRoomName=task.room;
        const targetResourceType=task.resourceType;
        const targetAmount=task.amount;
        
        if(task && targetRoomName && targetResourceType && targetAmount!=undefined){
            if(targetAmount<=0){
                deleteTask(tasks,0);
                return;
            }
            let state=checkIfCanSend(terminal,task);
            if(state['state']==OK){
                // send
                if(sendResource(terminal,task)==OK){
                    deleteTask(tasks,0);
                }
            }else if(state['state']==ERR_FULL){
                if(!terminal.store[targetResourceType]){
                    // log('Error! Terminal completely full.\nDetails:\n  [TerminalTask] From '+roomName+' to '+targetRoomName+'\n  '+targetAmount+'*'+targetResourceType+' -> [x]')
                    deleteTask(tasks,0);
                }else if(sendResource(terminal,task,terminal.store[targetResourceType])==OK){
                    task.amount-=terminal.store[targetResourceType];
                }
            }else if(state['state']==ERR_BUSY){    // ERR_NOT_ENOUGH_ENERGY
                if(!addResourceToTerminal(room,RESOURCE_ENERGY,state['amount'])){
                    // log('[Error] No energy 4 transaction cost.\nDetails: [TerminalTask] From '+roomName+' to '+targetRoomName+'\n  '+targetAmount+'*'+targetResourceType+' -> [x]')
                    deleteTask(tasks,0);
                }
            }else if(state['state']==ERR_NOT_ENOUGH_RESOURCES){
                if(!addResourceToTerminal(room,targetResourceType,state['amount'])){
                    // log('[Warning] Resources not enough, but it works.\nDetails: [TerminalTask] From '+roomName+' to '+targetRoomName+'\n  '+targetAmount+'*'+targetResourceType+' -> [x]')
                    task.amount=terminal.store[targetResourceType];
                }
            }
        }
    }
}
function addResourceToTerminal(room,targetResourceType,targetAmount){
    let depotsInfo=room.findM(targetResourceType);
    if(depotsInfo['state']==-1){
        deleteTask(tasks,0);
    }else if(depotsInfo['state']!=OK){
        return false;
    }
    if(!depotsInfo['num']){
        return false;
    }
    const depots=sortDepots(depotsInfo['depots']);
    if(!depots.length){
        return false;
    }
    for(let depot of depots){
        if(depot=='terminal') continue;   // ?
        const getObj=getObjectByType(room,depot);
        if(getObj.state==0){ var Obj=getObj[depot]; }
        else{ return false; }
        if(Obj.store[targetResourceType]>=targetAmount){
            newTask(room.name,depot,'terminal',targetResourceType,targetAmount,true);
            return true;
        }else{
            newTask(room.name,depot,'terminal',targetResourceType,Obj.store[targetResourceType],true);
            targetAmount-=Obj.store[targetResourceType];
        }
    }
    return true;
}
function checkNullObj(obj) {
    return Object.keys(obj).length === 0
}
function sortDepots(depots){
    // hardcode warning
    if(depots['storage']){
        if(depots['factory']){
            if(depots['storage']>=depots['factory']){
                return ['storage','factory'];
            }else{
                return ['factory','storage'];
            }
        }else{
            return ['storage'];
        }
    }else if(depots['factory']){
        return ['factory'];
    }
    return [];
}
function getObjectByType(room,structureType){
    if(structureType=='storage'){
        if(room.storage){
            return {'state':0,'storage':room.storage};
        }else{
            return {'state':-1};
        }
    }else if(structureType=='terminal'){
        if(room.terminal){
            return {'state':0,'terminal':room.terminal};
        }else{
            return {'state':-1};
        }
    }else if(structureType=='factory'){
        if(room.factory){
            return {'state':0,'factory':room.factory};
        }else{
            return {'state':-1};
        }
    }
    return {'state':-2};
}
function deleteTask(tasks,index){
    return tasks.splice(index,1);
}
function sendResource(terminal,task,fixedAmount=-1){
    const targetRoomName=task.room;
    const targetResourceType=task.resourceType;
    let targetAmount=task.amount;
    
    if(fixedAmount>=0){
        targetAmount=fixedAmount;
    }
    
    return terminal.send(targetResourceType, targetAmount, targetRoomName);
}
function checkIfCanSend(terminal,task){
    const roomName=terminal.room.name;
    const targetRoomName=task.room;
    const targetResourceType=task.resourceType;
    const targetAmount=task.amount;
    const transactionCost = Game.market.calcTransactionCost(targetAmount, roomName, targetRoomName);
    
    if(!terminal.store.getFreeCapacity()){
        return {'state':ERR_FULL};
    }
    
    if(terminal.store[RESOURCE_ENERGY]>=transactionCost){
        if(targetResourceType==RESOURCE_ENERGY){
            if(terminal.store[targetResourceType]-transactionCost>=targetAmount){
                return {'state':OK};
            }
            return {'state':ERR_NOT_ENOUGH_RESOURCES,'amount':targetAmount+transactionCost-terminal.store[targetResourceType]};
        }else{
            if(terminal.store[targetResourceType]>=targetAmount){
                return {'state':OK};
            }
            return {'state':ERR_NOT_ENOUGH_RESOURCES,'amount':targetAmount-terminal.store[targetResourceType]};
        }
    }
    return {'state':ERR_BUSY,'amount':transactionCost-terminal.store[RESOURCE_ENERGY]};
    
}
function getRoomByName(roomName){
    if(!Game.rooms[roomName]){
        return false;
    }
    return Game.rooms[roomName];
}
function init(roomName){
    if(!Game.rooms[roomName]){
        return false;
    }
    if(!Game.rooms[roomName].terminal){
        return false;
    }
    const roomMem=Memory.rooms[roomName];
    let init=false;
    if(roomMem){
        if(roomMem.terminal){
            if(roomMem.terminal.tasks){}
            else{
                roomMem.terminal.tasks=[];
            }
        }else{
            roomMem.terminal={'tasks':[]};
        }
    }else{
        Memory.rooms[roomName]={'terminal':{'tasks':[]}};
    }
    return true;
}
module.exports = terminalCtrl;