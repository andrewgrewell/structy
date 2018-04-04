<div align="center" markdown="1">

![Structy](https://github.com/andrewgrewell/structy/blob/master/logo.png)

**declarative immutable-ish data structures**

[![Maintainability](https://api.codeclimate.com/v1/badges/ba444709dbfd44f895f6/maintainability)](https://codeclimate.com/github/andrewgrewell/structy/maintainability)

</div>

Structy aims to provide a flexible and declarative api for managing your application's data. There are other great
libraries out there such as [Immutable](https://facebook.github.io/immutable-js/), but Structy provides a bit more sugar
to make managing your data easier. 

getting started
---
install with npm
```javascript
$ yarn add structy
```

import into your project
```javascript
import { Model, Collection } from 'structy';
// const { Model, Collection } = require('structy');
```


or add via global (use structy < 2.0.0)
```
<script src="https://cdn.jsdelivr.net/npm/structy@1.0.1/dist/structy.js" type="text/javascript"/>
<script type="text/javascript>
    const { Model, Collection } = structy;
    ...
</script>
```

Usage
---
below is an example of how you might use `Model` and `Collection` to structure your burger app's data.


we would start by defining the schema for our ingredients
```javascript
// extend model and specify the getters and setters for your specific Model
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

// Use Collections for structuring collections of data
// collection of ingredients with helpers for getting at item data
class IngredientCollection extends Collection {
    constructor(items) {
        super(items, Ingredient);
    }

    // collections are a good place for common methods for interacting with the data
    getTotalCost() {
        return this.reduce((totalCost, ingredient) => (totalCost += ingredient.getCost()), 0);
    }
}
```

Then we would define the schema for our burger, which includes ingredients
```javascript
// a burger and its cost are made up of its ingredients
const burgerConfig = {
    cost: { default: 3 }, // base cost is 3
    ingredients: IngredientCollection // Burger will wrap all 'ingredient' fields with a IngredientCollection
};

class Burger extends Model {
    constructor(data) {
        // call Model constructor and pass the burger data and fieldConfig
        super(data, burgerConfig);
    }

    // even though the consumer of this Burger Model could use Burger.name, it is better
    // to document the shape of your data via getters and setters.
    getName() {
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
        // here we reuse the IngredientCollection cost logic
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
        // again building on what we have already done, we reuse the IngredientCollection and Burger cost logic
        return this.reduce((totalCost, burger) => (totalCost += burger.getCost()), 0);
    }

    getFavorites() {
        return this.filter(burger => burger.isFavorite());
    }

    getBurgerNames() {
        return this.map(burger => burger.getName());
    }
}
```

finally we would define/fetch the data and start using it
```javascript
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
console.log('order items: ', order.getBurgerNames()); // order items: ['Hamburger']
console.log('order cost: ', order.getCost()); // order cost: 6.5

const updatedOrder = order.add(cheeseBurger);
console.log('order items: ', updatedOrder.getBurgerNames()); // order items: ['Hamburger', 'Cheese Burger']
console.log('order cost: ', updatedOrder.getCost()); // order cost: 14
console.log('did order change?', updatedOrder !== order);
```

API
---
#### **Model**
- **data {object}** - data that the model will operate on.
- **fieldConfig {object}** *optional* - specifies options for each field of the model.
- **filter {function}** *optional* - filter data, should return filtered data 

example field config:
```javascript
const fieldConfig = {
    '*': Number, // specify wildcard to pass the value of each field in data to Number constructor
    'foo': Model, // wildcard only applies to fields not defined
    'bar': {
        nullable: false, //fields with undefined/null values are ignored by default
        constructor: Model
    },
    'baz': {
        one: {
            default: 1
        },
        two: {
            default: (data) => data.baz.one ? null : true
        }
    }
}
```

#### **Collection**
- **items {array}** - initial items in the collection.
- **ItemConstructor {constructor}** - constructor to pass item(s) to.

*More API documentation coming shortly, until that time checkout [Model](https://github.com/andrewgrewell/structy/blob/master/src/Model.js) and [Collection](https://github.com/andrewgrewell/structy/blob/master/src/Collection.js)*
