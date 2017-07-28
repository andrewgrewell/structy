<div align="center" markdown="1">

![Structy](https://github.com/andrewgrewell/structy/blob/master/logo.png)

**declarative immutable-ish data structures**

</div>

Structy aims to provide a flexible and declarative api for managing your applications data. There are other great
libraries out there such as [Immutable](https://facebook.github.io/immutable-js/) but Structy aims to provide more
sugar for declairing the schema of your data. Structy has a few core concepts
1. Allow for Models fields to be configured via `fieldConfig` objects
```javascript
const fieldConfig = {
    myModelProperty: ConstructorForFieldType,
    anotherProperty: {
        nullable: false,
        constructor: ConstructorForFieldType
    }
}
```
2. Require Models to implement getters and setters to access their data, for the sake of self documentation
```javascript
class Todo extends Model {
    ...
    getTitle() {
        return this.get('title');
    }
    
    setTitle(title) {
        return this.set('title', title)
    }
}
```
3. Provide protection from accidentally mutating data
```javascript
const COLORS = ['red', 'green', 'blue'];
const colorPalette = new ColorPalette({ primary: COLORS[1], colors: COLORS });

const paletteOne = colorPalette.getColors();
...
paletteOne.push('hotpink');

console.log(paletteOne) // ['red', 'green', 'blue', 'hotpink']
console.log(COLORS) // ['red', 'green', 'blue']
console.log(colorPalette.getColors()) // ['red', 'green', 'blue']

colorPalette.colors = ['blue'] // Error cannot assign to read only property
colorPalette.colors[2] = 'green' // this works, but your going out of your way to do the wrong thing
```
The above example could be improved by using Collections as well as models, and you could save time by
specifying how the ColorPalette is constructed via a fieldConfig

