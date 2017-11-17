import Model from './src/Model';

const burgerSchema = {
    cost: { default: 1.99 },
    pickles: { default: false },
    ketchup: { default: false }
};

class Burger extends Model {
    constructor(data) {
        super(data, burgerSchema);
    }
}

const myBurger = new Burger({ cost: 2.50 });
console.log('myBurger: ', JSON.stringify(myBurger, null, 2));