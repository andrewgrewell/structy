const forEach = require('lodash.foreach');


export default function applyAccessors(Model, schema) {
    forEach(schema, (schemaValue, schemaKey) => {
        let getterName = 'get' + schemaKey.charAt(0).toUpperCase() + schemaKey.slice(1);
        let setterName = 'set' + schemaKey.charAt(0).toUpperCase() + schemaKey.slice(1);
        Object.defineProperties(Model.prototype, {
            [getterName]: {
                value() {
                    return this[schemaKey];
                },
                enumerable: true
            },
            [setterName]: {
                value(newValue) {
                    return this.set(schemaKey, newValue);
                },
                enumerable: true
            }
        });
    });
}