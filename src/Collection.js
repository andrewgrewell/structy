import Model from './Model';


export default class Collection {
    constructor(items, ItemConstructor) {
        if (items == null) {
            return;
        }
        if (items instanceof Collection || items.prototype instanceof Collection) {
            items = items.items;
        }
        items = Array.isArray(items) ? items : [items];
        this._defineProperties(items, ItemConstructor);
        this._initializeCollection(items);
    }

    _defineProperties(items, ItemConstructor) {
        return Object.defineProperties(this, {
            ItemConstructor: { value: ItemConstructor || Model },
            length: { value: items ? items.length : 0 },
            items: { value: [] }
        });
    }

    _initializeCollection(items) {
        items.forEach((item, i) => {
            let wrapped = this._checkWrapItem(item);
            this.items.push(wrapped);
            Object.defineProperty(this, i, {
                enumerable: true,
                value: wrapped
            });
        });
    }

    _checkWrapItem(item) {
        if (item instanceof this.ItemConstructor) {
            return item;
        }
        return new this.ItemConstructor(item);
    }

    _constructNew(items) {
        return new this.constructor(items);
    }

    values() {
        return this.items.values();
    }

    toArray() {
        return [...this.items];
    }

    get(index) {
        return this[index];
    }

    first() {
        return this.get(0);
    }

    last() {
        return this.get(this.items.length - 1);
    }

    add(item, index) {
        if (index != null) {
            return this.splice(index, 0, item);
        }
        return this._constructNew([...this.items, item]);
    }

    insert(item, index) {
        return this.add(item, index);
    }

    remove(index) {
        return this.splice(index, 1);
    }

    concat(item) {
        return this.add(item);
    }

    push(item) {
        return this.add(item);
    }

    prepend(item) {
        return this.splice(0, 0, item);
    }

    splice(start, removeCount, ...items) {
        let newItems = this.toArray();
        newItems.splice(start, removeCount, ...items);
        return this._constructNew(newItems);
    }

    slice(start, end) {
        let newItems = Array.slice(this.items, start, end);
        return this._constructNew(newItems);
    }

    unshift(item) {
        let newItems = this.toArray();
        return this._constructNew([item, ...newItems]);
    }

    indexOf(item) {
        return this.items.indexOf(item);
    }

    findIndex(fn) {
        return this.items.findIndex(fn);
    }

    hasItemBy(fn) {
        return this.findIndex(fn) !== -1;
    }

    includes(element, fromIndex) {
        return this.items.includes(element, fromIndex);
    }

    putBy(item, fn) {
        if (this.hasItemBy(fn)) {
            return this.replaceBy(item, fn);
        }
        else {
            return this.push(item);
        }
    }

    prependBy(item, fn) {
        if (this.hasItemBy(fn)) {
            return this.replaceBy(item, fn);
        }
        else {
            return this.prepend(item);
        }
    }

    replaceBy(item, fn) {
        let index = this.findIndex(fn);
        if (index === -1) {
            return this;
        }
        return item ? this.splice(index, 1, item) : this.splice(index, 1);
    }

    removeBy(fn) {
        let index = this.findIndex(fn);
        if (index === -1) {
            return this;
        }
        return this.remove(index);
    }
}