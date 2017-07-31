import Model from '../Model';


describe('Model', () => {

    let testData;
    let setupModel;
    beforeEach(() => {
        testData = {
            type: 'test',
            name: 'testData',
            items: 'itemOne'
        };
        setupModel = (config, data) => {
            data = data || testData;
            return new Model(data, config);
        };
    });

    it('wraps data with a model', () => {
        let testModel = new Model(testData);
        expect(testModel).toBeInstanceOf(Model);
    });

    it('wraps fields with constructor from fieldConfig', () => {
        let testModel = new Model(testData, {
            items: Array
        });
        expect(testModel.get('items')).toEqual(expect.arrayContaining(['itemOne']));
    });

    it('supports nullable fields as default behavior', () => {
        let testModel = setupModel({
            foo: Array
        });
        expect(testModel.get('foo')).toBeUndefined();
    });

    it('provides a default value if specified in config', () => {
        let defaultId = 99;
        let testModel = new Model(testData, {
            id: { default: defaultId }
        });
        expect(testModel.get('id')).toEqual(defaultId);
    });

    it('supports provider as default value', () => {
        let testModel = setupModel({
            id: { default: (data) => `id:${data.name}` }
        });
        expect(testModel.get('id')).toEqual(`id:${testData.name}`);
    });

    it('supports non nullable field', () => {
        let testModel = setupModel({
            count: {
                nullable: false,
                constructor: Number
            }
        });
        expect(testModel.get('count')).toBeInstanceOf(Number);
    });

    it('supports nested values in field config', () => {
        let testModel = setupModel({
            foo: {
                bar: {
                    default: () => 'baz'
                }
            }
        });
        expect(testModel.getIn(['foo', 'bar'])).toEqual('baz');
    });

    it('supports wildcard config field', () => {
        let testModel = setupModel({
            '*': Array,
            'two': Number
        }, { one: 1, two: 2, three: 3 });
        expect(testModel.get('one')).toBeInstanceOf(Array);
        expect(testModel.get('two')).toBeInstanceOf(Number);
        expect(testModel.get('three')).toBeInstanceOf(Array);

    });

    it('is practically immutable', () => {
        let data = {
            foo: 'bar',
            items: [1, 2, 3]
        };
        let testModel = setupModel(null, data);
        expect(() => (testModel.foo = 'error')).toThrow();
    });

    it('can be enumerated/destructured', () => {
        let testModel = setupModel();
        expect(...testModel).toEqual(...testData);
    });
});