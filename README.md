<div align="center" markdown="1">

![Structy](https://github.com/andrewgrewell/structy/blob/master/logo.png)

**declarative immutable-ish data structures**

</div>

Structy aims to provide a flexible and declarative api for managing your application's data. There are other great
libraries out there such as [Immutable](https://facebook.github.io/immutable-js/), but Structy provides a bit more sugar
to make managing your data easier. 

### getting started
install with npm
```javascript
$ yarn add structy
```

### API
#### **Model**
- **data: {object}** - data that the model will operate on.
- **fieldConfig:{object}** *optional* - specifies options for each field of the model
```javascript
const fieldConfig = {
    '*': Number // specify wildcard to pass the value of each field in data to Number constructor
    'foo': FooModel // wildcard only applies to fields not defined
}
```

#### **Collection**
- **
#### Usage
below is an example of how BurgerTown uses structy to structure the data in their burger ordering app.
```javascript
import { Model, Collection } from 'structy';

class Burger extends Model {
    constructor(data) {
        // call Model constructor and pass the burger data and fieldConfig
        super(data, burgerConfig);
    }
}
```


