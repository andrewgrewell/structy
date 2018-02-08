import Model from '../src/Model';
import applyAccessors from '../src/util/applyAccessors';


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

applyAccessors(Burger, burgerSchema);


let myBurger = new Burger({ cost: 2.50 });
console.log('myBurger: ', JSON.stringify(myBurger, null, 2));
myBurger = myBurger.setPickles(true);
