import Model from './src/Model';
const mergeConfigs = Model.mergeFieldConfigs;


class Pedals extends Model {

    static defaultSpeed = 10;

    getSpeed() {
        return this.get('speed') || Pedals.defaultSpeed;
    }
}

const handlebarConfig = {
    grips: Model,
    breakLevers: Model
};

class Handlebars extends Model {
    constructor(data) {
        super(data, handlebarConfig);
    }
}

const containerConfig = {
    contents: Array // would be better for 'contents' to be a Collection, especially since it is being returned from Container
};

class Container extends Model {
    constructor(data, config) {
        super(data, mergeConfigs(containerConfig, config));
    }

    getContents() {
        return this.get('contents');
    }

    addItem(item) {
        return this.set('contents', this.contents.concat([item]));
    }

    removeItem() {
        this.contents.pop();
        return this.set('contents', this.contents);
    }
}

const backpackConfig = {
    contents: {
        default: ['rope', 'bubble gum']
    }
};

class Backpack extends Container {
    constructor(data) {
        super(data, backpackConfig);
    }
}

const personConfig = {
    backpack: Backpack
};

class Person extends Model {
    constructor(data, config) {
        super(data, mergeConfigs(personConfig, config));
    }

    getName() {
        return this.get('name');
    }

    getAge() {
        return this.get('age');
    }

    getBackpack() {
        return this.get('backpack');
    }
}

const hikerConfig = {
    backpack: {
        nullable: false,
        constructor: Backpack
    }
};

class Hiker extends Person {
    constructor(data) {
        super(data, hikerConfig);
    }

    getHydration() {
        return this.get('hydration');
    }
}

const bikeConfig = {
    rider: Hiker,
    basket: Container,
    color: {
        default: 'green'
    },
    parts: {
        pedals: {
            nullable: false,
            constructor: Pedals
        },
        handleBars: Handlebars,
        seatType: {
            default: 'generic seat',
        }
    }
};

class Bike extends Model {
    constructor(data) {
        super(data, bikeConfig);
    }

    getRider() {
        return this.get('rider');
    }

    pedal() {
        return this.get('pedals').getSpeed();
    }

    getColor() {
        this.get('color');
    }
}

let billsBike = new Bike({
    rider: {
        name: 'bill',
        age: 65,
        backpack: {
            contents: ['bike pump']
        }
    },
    parts: {
        handleBars: {
            grips: {
                color: 'red',
                stickyFactor: 10
            },
            breakLevers: {
                color: 'green'
            }
        }
    }
});

console.log('billsBike: ', billsBike);