import Model from './Model';


export default class Collection {
    constructor(items, ItemConstructor) {
        items = Array.isArray(items) ? items : [items];
        Object.defineProperties(this, {
            ItemConstructor: { value: ItemConstructor || Model },
            length: { value: items ? items.length : 0 },
            items: { value: [] }
        });
    }

    _initializeCollection(items) {
        items.forEach((item, i) => {
            this.items.push(item);
            Object.defineProperty(this, i, {
                enumerable: true,
                value: this._checkWrapItem(item)
            });
        });
    }

    _checkWrapItem(item) {
        if (item instanceof this.ItemConstructor) {
            return item;
        }
    }
}