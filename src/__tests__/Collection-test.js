import Collection from '../Collection';
import Model from '../Model';


class TestModel extends Model {
    constructor(data) {
        super(data);
    }
}


describe('Collection', () => {
    let items;
    let testCollection;
    let defaultNewItem;

    beforeEach(() => {
        items = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ];
        testCollection = new Collection(items);
        defaultNewItem = { id: 6 };
    });

    it('wraps an array of items', () => {
        expect(testCollection.length).toEqual(items.length);
    });

    it('returns instances of Model if no ItemConstructor', () => {
        expect(testCollection.get(0)).toBeInstanceOf(Model);
    });

    it('returns instances of ItemConstructor', () => {
        const collection = new Collection(items, TestModel);
        expect(collection.get(0)).toBeInstanceOf(TestModel);
    });

    it('is iterable/spreadable', () => {
        expect([...testCollection]).toEqual(expect.arrayContaining(items));
    });

    it('implements toArray', () => {
        expect(testCollection.toArray()).toEqual(expect.arrayContaining(items));
    });

    it('implements get', () => {
        expect(testCollection.get(2)).toEqual(items[2]);
    });

    it('implements splice', () => {
        let insertIndex = 3;
        let stateB = testCollection.splice(insertIndex, 0, defaultNewItem);
        expect(stateB.length).toEqual(items.length + 1);
        expect(stateB.get(insertIndex)).toEqual(defaultNewItem);
    });

    it('implements add', () => {
        let stateB = testCollection.add(defaultNewItem);
        expect(stateB.length).toEqual(items.length + 1);
        expect(stateB.last()).toEqual(defaultNewItem);
        expect(stateB).not.toBe(testCollection);
    });

    it('implements insert', () => {
        let stateB = testCollection.insert(defaultNewItem, 0);
        expect(stateB.length).toEqual(items.length + 1);
        expect(stateB.get(0)).toEqual(defaultNewItem);
    });

    it('implements remove', () => {
        let removeIndex = 0;
        let stateB = testCollection.remove(removeIndex);
        expect(stateB.length).toEqual(items.length - 1);
        expect(stateB).not.toEqual(expect.arrayContaining([items[removeIndex]]));
    });

    it('implements slice', () => {
        let stateB = testCollection.slice(-2, -1);
        expect(stateB.length).toEqual(1);
        expect(stateB[0]).toEqual(items[3]);
        expect(stateB).not.toBe(testCollection);
    });

    it('implements findIndex', () => {
        let indexToFind = 3;
        let itemToFind = items[indexToFind];
        let findById = (item) => item.id === itemToFind.id;
        expect(testCollection.findIndex(findById)).toEqual(indexToFind);
    });

    it('implements values', () => {
        let iterator = testCollection.values();
        expect(iterator.next()).toEqual({ done: false, value: items[0] });
    });

    it('implements removeBy', () => {
        let indexToRemove = 2;
        let itemToRemove = items[indexToRemove];
        let remover = item => item.id === itemToRemove.id;
        let stateB = testCollection.removeBy(remover);

        expect(stateB.length).toEqual(items.length - 1);
        expect(stateB).not.toEqual(expect.arrayContaining([itemToRemove]));
    });

    it('implements replaceBy', () => {
        let indexToReplace = 2;
        let replacer = (item, i) => i === indexToReplace;
        let stateB = testCollection.replaceBy(defaultNewItem, replacer);
        expect(stateB.length).toEqual(items.length);
        expect(stateB.get(indexToReplace)).toEqual(defaultNewItem);
        let itemNotToAdd = { id: 7 };
        let stateC = stateB.replaceBy(itemNotToAdd, () => false);
        expect(stateC.length).toEqual(items.length);
        expect(stateC).not.toEqual(expect.arrayContaining([itemNotToAdd]));
    });

    it('implments putBy', () => {
        let newItem = { id: 1, isNew: true };
        let replacer = (i => i.id === newItem.id);
        let stateB = testCollection.putBy(newItem, replacer);
        expect(stateB.length).toEqual(items.length);
        let newItemInCollection = stateB.find(i => i.id === newItem.id);
        expect(newItemInCollection.isNew).toBeTruthy();
    });
});