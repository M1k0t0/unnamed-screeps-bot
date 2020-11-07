/*
 * 市场模块 v0.1
 * 无配置文件
 * 数据存储在 Memory.rooms[roomName]['terminal']['marketTasks']
 *
 * 功能:
 *   [√] 自动寻找可deal订单（买，卖）
 *   [x] 自动挂单
 *   [√] 自动补充资源（需调用市场模块，中心转运模块）
 */

const DEAL_RATIO = {
    // 卖单的最高价格
    MAX: 1.8,
    // 买单的最低价格
    MIN: 0.7
}

module.exports = {
    run:function(roomName){
        if(!init(roomName)){
            return;
        }
        const room=Game.rooms[roomName];
        const terminal=room.terminal;
        const sList=Memory.rooms[roomName]['terminal']['marketTasks'];
        for(let index in sList){
            const task=sList[index];
            const targetResourceType=task['resourceType'];
            let targetAmount=task['amount'];
            let targetPrice=task['price'];
            let targetDealTick=task['dealTick'];
            let targetRoomName=task['targetRoom'];
            
            if(task){
                // task = { ... };
                // {
                //     'type':ORDER_SELL,
                //     'resourceType':'hydraulics',
                //     'amount':10,
                //     'price':40000,
                //     'dealTick':0
                //     'targetRoom':'W25S11'
                // }
                
                if(targetDealTick){
                    var record;
                    if(task['type']==ORDER_SELL){
                        record=Game.market.outgoingTransactions.filter(t=>t.time==targetDealTick&&t.from==roomName&&t.resourceType==targetResourceType&&t.to==targetRoomName);
                    }else{
                        record=Game.market.incomingTransactions.filter(t=>t.time==targetDealTick&&t.from==targetRoomName&&t.resourceType==targetResourceType&&t.to==roomName);
                    }
                    if(record.length){
                        task['amount']-=record[0].amount;
                        targetAmount-=record[0].amount;
                        task['dealTick']=0;
                    }
                }
                if(targetAmount<=0){
                    sList.splice(index,1);
                    continue;
                }
                if(task['type']==ORDER_SELL){
                    if(Game.time%10!=3) return;
                    if(terminal.store[targetResourceType]){
                        if(targetPrice){
                            targetRoomName=seller(roomName,targetResourceType,targetAmount,targetPrice);
                            if(targetRoomName){
                                task['dealTick']=Game.time;
                                task['targetRoom']=targetRoomName;
                                break;
                            }else{
                                console.log("[Market] can't deal with order "+roomName+"-"+targetResourceType+"-"+targetAmount);
                                // sList.splice(index,1);
                                continue;
                            }
                        }else{
                            targetRoomName=seller(roomName,targetResourceType,targetAmount);
                            if(targetRoomName){
                                task['dealTick']=Game.time;
                                task['targetRoom']=targetRoomName;
                                break;
                            }else{
                                console.log("[Market] can't deal with order "+roomName+"-"+targetResourceType+"-"+targetAmount);
                                // sList.splice(index,1);
                                continue;
                            }
                        }
                        
                    }
                }else if(task['type']==ORDER_BUY){
                    if(Game.time%10!=3) return;
                    if(terminal.store[RESOURCE_ENERGY] && Game.rooms[roomName].terminal.store.getFreeCapacity()){
                        if(targetPrice){
                            targetRoomName=buyer(roomName,targetResourceType,targetAmount,targetPrice);
                            if(targetRoomName){
                                task['dealTick']=Game.time;
                                task['targetRoom']=targetRoomName;
                                break;
                            }else{
                                console.log("[Market] can't deal with order "+roomName+"-"+targetResourceType+"-"+targetAmount);
                                // sList.splice(index,1);
                                continue;
                            }
                        }else{
                            targetRoomName=buyer(roomName,targetResourceType,targetAmount);
                            if(targetRoomName){
                                task['dealTick']=Game.time;
                                task['targetRoom']=targetRoomName;
                                break;
                            }else{
                                console.log("[Market] can't deal with order "+roomName+"-"+targetResourceType+"-"+targetAmount);
                                // sList.splice(index,1);
                                continue;
                            }
                        }
                        
                    }
                }
            }
        }
    }
};

function buyer(roomName,rType,maxNum,expect){
    if(Game.rooms[roomName].terminal && Game.rooms[roomName].terminal.store.getFreeCapacity() && Game.rooms[roomName].terminal.store[RESOURCE_ENERGY]){
        orders = _.sortBy(Game.market.getAllOrders({type: ORDER_SELL, resourceType: rType}), function(o) { return o.price; });
        //console.log(1)
        for(let i=0; i<orders.length; i++) {
            if(!orders[i].amount) continue;
            let amount=maxNum;
            if(amount>Game.rooms[roomName].terminal.store[RESOURCE_ENERGY]){
                amount=Game.rooms[roomName].terminal.store[RESOURCE_ENERGY];
            }
            if(amount){
                if(((expect && orders[i].price<=expect) || (!expect && checkPrice(orders[i]))) && Game.rooms[roomName].terminal.cooldown==0) {
                    if(Game.market.deal(orders[i].id, amount, roomName)==0){
                        console.log('Buy resources from',orders[i].roomName,'. Trade resource type: '+rType);
                        return orders[i]['roomName'];
                    }
                    else{
                        console.log('Error when try to make deal with',orders[i].roomName,'. Trade resource type: '+rType+'   Amount: '+amount,'Code: '+Game.market.deal(orders[i].id, amount, roomName));
                        return false;
                    }
                    
                }
            }
        }
        return false;
    }else return false;
}
function seller(roomName,rType,maxNum,expect){
    //console.log(Game.rooms[roomName].terminal.store[rType])
    if(Game.rooms[roomName].terminal && Game.rooms[roomName].terminal.store[rType] && Game.rooms[roomName].terminal.store[RESOURCE_ENERGY]){
        orders = _.sortBy(Game.market.getAllOrders({type: ORDER_BUY, resourceType: rType}), function(o) { return -o.price; });
        //console.log(1)
        for(let i=0; i<orders.length; i++) {
            let amount=maxNum;
            if(Game.rooms[roomName].terminal.store[rType]<amount) amount=Game.rooms[roomName].terminal.store[rType];
            if(amount>Game.rooms[roomName].terminal.store[RESOURCE_ENERGY]){
                amount=Game.rooms[roomName].terminal.store[RESOURCE_ENERGY];
            }
            if(amount){
                if(((expect && orders[i].price>=expect) || checkPrice(orders[i])) && Game.rooms[roomName].terminal.cooldown==0) {
                    if(Game.market.deal(orders[i].id, amount, roomName)==0){
                        console.log('Sell resources to',orders[i].roomName,'. Trade resource type: '+rType);
                        return orders[i]['roomName'];
                    }
                    else{
                        console.log('Error when try to make deal with',orders[i].roomName,'. Trade resource type: '+rType+'   Amount: '+amount,'Code: '+Game.market.deal(orders[i].id, amount, roomName));
                        return false;
                    }
                    
                }
            }
        }
        return false;
    }
}
function checkPrice(targetOrder){
    const history = Game.market.getHistory(targetOrder.resourceType);
    // 没有历史记录就阻止购买
    if (history.length <= 0) return false;
    // 以昨日均价为准
    // console.log(JSON.stringify(history[0], null, 4))
    const avgPrice = history[0].avgPrice;

    // 目标订单的价格要在规定好的价格区间内浮动才算可靠
    // 卖单的价格不能太高
    if (targetOrder.type == ORDER_SELL) {
        // console.log(`${targetOrder.price} <= ${avgPrice * DEAL_RATIO.MAX}`)
        if (targetOrder.price <= avgPrice * DEAL_RATIO.MAX) return true;
    }
    // 买单的价格不能太低
    else {
        // console.log(`${targetOrder.price} >= ${avgPrice * DEAL_RATIO.MIN}`)
        if (targetOrder.price >= avgPrice * DEAL_RATIO.MIN) return true;
    }
    return false;
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
            if(roomMem.terminal.marketTasks){}
            else{
                roomMem.terminal.marketTasks=[];
            }
        }else{
            roomMem.terminal={'marketTasks':[]};
        }
    }else{
        Memory.rooms[roomName]={'terminal':{'marketTasks':[]}};
    }
    return true;
}