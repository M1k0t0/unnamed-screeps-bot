Object.defineProperty(Creep.prototype,'isEmpty',{
    get(){
        return !this.store.getUsedCapacity();
    }
});
Object.defineProperty(Creep.prototype,'isFull',{
    get(){
        return !this.store.getFreeCapacity();
    }
});
Object.defineProperty(Creep.prototype,'storeList',{
    get(){
        return _.keys(this.store);
    }
});
Object.defineProperty(Creep.prototype,'onEdge',{
    get(){
        return (this.pos.x==49 || this.pos.x==0) || (this.pos.y==49 || this.pos.y==0);
    }
});

Object.defineProperty(Room.prototype,'center',{
    get(){
        return new RoomPosition(Memory.rooms[this.name].core[0],Memory.rooms[this.name].core[1],this.name);
    }
});