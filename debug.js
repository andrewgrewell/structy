import Collection from './src/Collection';
import Model from './src/Model';


class IceCream extends Model {
    constructor(data) {
        super(data);
    }

    getFlavor() {
        return this.get('flavor');
    }

    isMelted() {
        return this.get('melted');
    }

    setMelted(melted) {
        return this.set('melted', melted);
    }
}

class IceCreamCollection extends Collection {
    constructor(data) {
        super(data, IceCream);
    }
}

const truckConfig = {
    iceCream: { nullable: false, constructor: IceCreamCollection }
};

class IceCreamTruck extends Model {
    constructor(data) {
        super(data, truckConfig);
    }

    getSound() {
        return this.get('sound');
    }

    getIceCream() {
        return this.iceCream;
    }
}

const iceCreamWagon = new IceCreamTruck({
    sound: 'beep boop beep boop',
    iceCream: [
        { flavor: 'Rocky Road', count: 10 },
        { flavor: 'Chocolate', count: 5 },
        { flavor: 'Vanilla', count: 5 },
        { flavor: 'Bubblegum', count: 20 }
    ]
});

let items = iceCreamWagon.getIceCream();

let newItems = items.unshift({ flavor: 'Mint Chip', count: 1 });

console.log('items: ', items);
console.log('-----');
console.log('new items: ', newItems);
console.log('equal: ', items === newItems);