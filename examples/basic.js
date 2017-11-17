import Model from '../src/Model';
import Collection from '../src/Collection';

// base ingredient e.g. pickles
class Ingredient extends Model {
    constructor(data) {
        super(data);
    }

    getType() {
        return this.type;
    }

    getCost() {
        return this.cost;
    }
}

// collection of ingredients with helpers for getting at item data
class IngredientCollection extends Collection {
    constructor(items) {
        super(items, Ingredient);
    }

    getTotalCost() {
        return this.reduce((totalCost, ingredient) => (totalCost += ingredient.getCost()), 0);
    }
}

// a burger and its cost are made up of its ingredients
const burgerConfig = {
    cost: { default: 3 }, // base cost is 3
    ingredients: IngredientCollection
};

class Burger extends Model {
    constructor(data) {
        // call Model constructor and pass the burger data and fieldConfig
        super(data, burgerConfig);
    }

    getName() {
        // even though the consumer of this Burger Model could use Burger.name, it is better
        // to document the shape of your data via getters and setters.
        return this.name;
    }

    isFavorite() {
        return this.favorite;
    }

    setFavorite(fav) {
        // note: setters are required since the data is immutable
        // this.favorite = fav will throw
        return this.set('favorite', fav);
    }

    getCost() {
        return this.cost + this.ingredients.getTotalCost();
    }

    getIngredients() {
        return this.ingredients;
    }

    hasIngredient(type) {
        return this.ingredients.some(i => i.type === type);
    }
}

class BurgerCollection extends Collection {
    constructor(items) {
        super(items, Burger);
    }

    getCost() {
        return this.reduce((totalCost, burger) => (totalCost += burger.getCost()), 0);
    }

    getFavorites() {
        return this.filter(burger => burger.isFavorite());
    }

    getBurgerNames() {
        return this.map(burger => burger.getName());
    }
}

const hamburger = {
    name: 'Hamburger',
    ingredients: [
        { type: 'beef', cost: 1 },
        { type: 'ketchup', cost: 0.5 },
        { type: 'mustard', cost: 0.5 },
        { type: 'lettuce', cost: 0.25 },
        { type: 'tomato', cost: 1 },
        { type: 'pickle', cost: 0.25 }
    ]
};

const cheeseBurger = {
    name: 'Cheese Burger',
    ingredients: [
        ...hamburger.ingredients,
        { type: 'cheese', cost: 1 }
    ]
};

const order = new BurgerCollection([hamburger]);
console.log('order items: ', order.getBurgerNames());
console.log('order cost: ', order.getCost());

const updatedOrder = order.add(cheeseBurger);
console.log('order items: ', updatedOrder.getBurgerNames());
console.log('order cost: ', updatedOrder.getCost());
console.log('did order change?', updatedOrder !== order);